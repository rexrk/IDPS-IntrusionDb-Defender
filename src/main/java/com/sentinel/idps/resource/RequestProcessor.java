package com.sentinel.idps.resource;

import com.sentinel.idps.entity.Application;
import com.sentinel.idps.entity.Attacks;
import com.sentinel.idps.entity.Role;
import com.sentinel.idps.entity.UserDetails;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

@RestController
public class RequestProcessor {

    private final AppResource appResource;
    private final UserResource userResource;
    private final AttacksController attacksController;
    private String message = "Couldn't process request";

    public RequestProcessor(AppResource appResource, UserResource userResource, AttacksController attacksController) {
        this.appResource = appResource;
        this.userResource = userResource;
        this.attacksController = attacksController;
    }

    private UserDetails userDetails;
    private String applicationName;

    @PostMapping("/request-processor/{appName}")
    public ResponseEntity<String> requestProcessor(@RequestBody UserDetails userDetails, @PathVariable String appName) {
        this.applicationName = appName;
        this.userDetails = userDetails;
        if (requestHandler()) {
            return ResponseEntity.ok("Request processed successfully");
        }
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(message);
    }

    public Boolean requestHandler() {
        //Handle the request
        //Check App Exist.
        Boolean appExists = appExists();
        if (!appExists) {
            return false;
        }

        //User Exists
        Boolean userExists = userExists();
        if (!userExists) {
            return false;
        }

        //rate limiters
        Boolean isRateLimited = isRateLimited();
        if (isRateLimited) {
            return false;
        }

        // privilege escalation
        Boolean isPrivileged = isPrivileged();
        if (!isPrivileged) {
            return false;
        }

        //dbInjection attack = basic sql injections, queries, javascript
        Boolean directDbAttack = isDirectDatabaseInjection();
        if (directDbAttack) {
            return false;
        }

        Boolean sqlInjection = checkORExpression();
        if (sqlInjection) {
            return false;
        }

        //ip check from website
        Boolean isBlackListed = isIPListedOnAbuseIPDB();
        return !isBlackListed;
    }

    private Boolean appExists() {
        if (appResource.appExists(applicationName)) {
            return true;
        }
        attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "Brute Force",
                userDetails.getExecutingQuery() + " query on resource.",
                "Low", "Denied", "Requested resource from an unknown or invalid application.", applicationName);
        message = "Invalid Application";
        return false;
    }

    private Boolean userExists() {
        String username = userDetails.getUsername();
        UserDetails tempUserDetails = userResource.getUserByUsername(username);
        if (tempUserDetails != null && tempUserDetails.getUsername().equals(username)) {
            this.userDetails = userResource.updateUser(userDetails);
            return true;
        } else {
            attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "Invalid User",
                    userDetails.getExecutingQuery() + " query on resource.",
                    "Medium", "Denied", "Attempted access with an invalid or unauthorized user.", applicationName);
            message = "Invalid User";
            return false;
        }
    }

    private Boolean isPrivileged() {
        Application application = appResource.getApplicationByName(applicationName);

        String executingQuery = userDetails.getExecutingQuery();
        String userRole = userDetails.getRole();

        Optional<Role> userRoleOptional = application.getRoles().stream()
                .filter(appRole -> appRole.getRoleName().equals(userRole))
                .findFirst();

        if (userRoleOptional.isEmpty()) {
            attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "Unauthorized Access",
                    userDetails.getExecutingQuery() + " query on resource.",
                    "High", "Denied", "Role isn't defined or assigned to the user.", applicationName);
            message = "Invalid User Role";
            message = "Role isn't assigned to user";
            return false;
        }

        Role userRoleTemp = userRoleOptional.get();

        // Check if the user has the privilege equal to the executing query
        boolean hasPrivilege = userRoleTemp.getPrivileges().stream()
                .anyMatch(privilege -> privilege.toString().equalsIgnoreCase(executingQuery));
        if (!hasPrivilege) {
            attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "Privilege Escalation",
                    userDetails.getExecutingQuery() + " query on resource.",
                    "High", "Denied", "Detected attempt to access resources beyond user's assigned privileges.", applicationName);
            message = "Privilege is not assigned to user";
            return false;
        }

        return true;
    }

    private Boolean isDirectDatabaseInjection() {
        String executingQuery = userDetails.getExecutingQuery().toLowerCase();

        // Define a list of suspicious keywords or patterns indicating potential SQL injection
        List<String> suspiciousPatterns = Arrays.asList("SELECT * FROM", "DELETE FROM", "INSERT INTO", "DELETE * FROM", "<script>");

        // Check if the executing query contains any of the suspicious patterns
        if (suspiciousPatterns.stream().anyMatch(executingQuery::contains)) {
            attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "Database Injection",
                    userDetails.getExecutingQuery() + " query on resource.",
                    "High", "Denied", "Detected direct database injection attack.", applicationName);
            message = "Direct database injection attack detected";
            return true;
        }
        return false;
    }

    private Boolean checkORExpression() {
        // Convert the input string to upper case for case-insensitive comparison
        String str = userDetails.getExecutingQuery().toUpperCase();

        // Look for the occurrence of " OR " in the string
        int orIndex = str.indexOf(" OR ");

        // If " OR " is found, and it is followed by an "=", return true
        if (orIndex != -1) {
            int eqIndex = str.indexOf("=", orIndex);
            if (eqIndex != -1 && orIndex < eqIndex) {
                attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "SQL Injection",
                        userDetails.getExecutingQuery() + " query on resource.",
                        "High", "Denied", "Detected a potential SQL injection attempt.", applicationName);
                message = "Potential SQL Injection attempt";
                return true;
            }
        }

        return false;
    }

    private Boolean isRateLimited() {
        List<Attacks> attacks = attacksController.getAttackByUsername(userDetails.getUsername());

        // Calculate the current time
        LocalDateTime currentTime = LocalDateTime.now();

        // Calculate the time 10 seconds ago
        LocalDateTime tenSecondsAgo = currentTime.minus(Duration.ofSeconds(10));

        // Count the number of attacks within the last 10 seconds
        long count = attacks.stream()
                .filter(attack -> attack.getTimestamp().isAfter(tenSecondsAgo))
                .count();

        // Return true if the count is greater than or equal to 5
        if (count >= 5) {
            attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "Rate Limiting",
                    userDetails.getExecutingQuery() + " query on resource.",
                    "Medium", "Rate Limited", "User is being rate-limited due to excessive access attempts.", applicationName);
            message = "User is being rate limited";
            return true;
        }
        return false;
    }

    @Value("${apiKey}")
    private String apiKey;
    private static final String ABUSE_IPDB_API_URL = "https://www.abuseipdb.com/check/";
    private final RestTemplate restTemplate = new RestTemplate();

    // Method to check if an IP address is listed on AbuseIPDB
    private Boolean isIPListedOnAbuseIPDB() {
        String ipAddress = userDetails.getIpAddress();
        try {
            String url = ABUSE_IPDB_API_URL + ipAddress + "?api_key=" + apiKey;
            ResponseEntity<String> response = restTemplate.getForEntity(url, String.class);
            if(response.getStatusCode().is2xxSuccessful()) {
                attacksController.createAttack(userDetails.getUsername(), userDetails.getIpAddress(), "Blacklisting",
                        userDetails.getExecutingQuery()  + " query on resource.",
                        "High", "Restricted", "User is found blacklisted on other websites.", applicationName);
                message = "User is found blacklisted";
                return true;
            }
        } catch (RestClientException e) {
            return false;
        }
        return false;
    }

}
