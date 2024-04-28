import "./IdpsApp.css";
import illustration from "./assets/images/illustration.jpg";
function WelcomeComponent() {
  return (
    <div className="welcomeComponent">
      <div className="text-container">
        <h1 className="heading">Welcome to Intrusion Detection and Prevention System</h1>
        <p className="description">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc condimentum nisi id nisi ultricies, 
          ac ullamcorper metus consectetur. Vivamus vel tellus purus.
        </p>
        <img src={illustration} alt="Illustration" className="illustration" style={{width:"100vh"}} />
      </div>
    </div>
  );
}

export default WelcomeComponent;
