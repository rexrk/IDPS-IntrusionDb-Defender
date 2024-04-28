package com.sentinel.idps.resource;
import com.sentinel.idps.entity.Application;
import com.sentinel.idps.repository.AppRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/applications")
public class AppResource {
    private final AppRepository appRepository;

    public AppResource(AppRepository appRepository) {
        this.appRepository = appRepository;
    }

    @PostMapping("")
    public Application addApplication(@RequestBody Application application) {
        return appRepository.save(application);
    }

    @GetMapping("")
    public List<Application> getAllApplications() {
        return appRepository.findAll();
    }

    @GetMapping("/{id}")
    public Application getApplicationById(@PathVariable Integer id) {
        return appRepository.findById(id).orElse(null);
    }

    @DeleteMapping("/{id}")
    public void deleteApplicationById(@PathVariable Integer id) {
        appRepository.deleteById(id);
    }

    @GetMapping("/{applicationName}")
    public Application getApplicationByName(@PathVariable String applicationName) {
        return appRepository.findByApplicationName(applicationName);
    }

    public Boolean appExists(String appName) {
        List<Application> lists = getAllApplications();
        Application app = lists.stream().
                filter(list -> list.getApplicationName().equals(appName))
                .findFirst().orElse(null);
        return app != null;
    }

}