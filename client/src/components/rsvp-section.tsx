import { useRef, useState, useEffect } from "react";

export function RsvpSection() {
  const ref = useRef(null);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    attending: "Joyfully accepts",
    guestCount: 1,
  });

  // Effect to handle guest count input behavior
  useEffect(() => {
    const guestInput = document.querySelector('input[name="guestCount"]') as HTMLInputElement | null;
    
    if (guestInput) {
      const handleInput = () => {
        // Allow empty strings while user is editing
        if (guestInput.value === "") return;

        // Prevent values below 1
        if (parseInt(guestInput.value) < 1) {
          guestInput.value = "";
        }
      };

      const handleBlur = () => {
        // Reset to 1 if left empty or invalid
        const num = parseInt(guestInput.value);
        if (isNaN(num) || num < 1) {
          guestInput.value = "1";
          // Update the formData state as well
          setFormData(prev => ({ ...prev, guestCount: 1 }));
        } else if (num > 10) {
          guestInput.value = "10";
          setFormData(prev => ({ ...prev, guestCount: 10 }));
        } else {
          setFormData(prev => ({ ...prev, guestCount: num }));
        }
      };

      guestInput.addEventListener('input', handleInput);
      guestInput.addEventListener('blur', handleBlur);

      return () => {
        guestInput.removeEventListener('input', handleInput);
        guestInput.removeEventListener('blur', handleBlur);
      };
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      attending: value
    }));
  };

  const handleGuestCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // For the React state, we want to handle the value properly
    // If the value is empty or not a valid number, we'll keep it as an empty string in the input
    // but maintain the previous valid number in state
    if (value === "" || isNaN(parseInt(value))) {
      // Don't update the state, just let the input be empty
      // The state will retain the last valid number
    } else {
      const numValue = parseInt(value);
      if (numValue >= 1 && numValue <= 10) {
        setFormData(prev => ({ ...prev, guestCount: numValue }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Ensure guestCount is a valid number before submitting
    const guestCountValue = Math.max(1, Math.min(10, formData.guestCount));

    // Create form data for Jotform submission
    const jotformData = new FormData();
    jotformData.append("q3_name[first]", formData.firstName);
    jotformData.append("q3_name[last]", formData.lastName);
    jotformData.append("q4_email", formData.email);
    jotformData.append("q5_willYou", formData.attending);
    jotformData.append("q6_numberOf", guestCountValue.toString());
    
    try {
      const response = await fetch("https://submit.jotform.com/submit/253035511518046", {
        method: "POST",
        body: jotformData,
        headers: {
          "Accept": "application/json"
        }
      });
      
      if (response.ok) {
        setSubmitted(true);
      } else {
        alert("There was an error submitting your RSVP. Please try again.");
      }
    } catch (error) {
      alert("There was an error submitting your RSVP. Please try again.");
    }
  };

  const handleReset = () => {
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      attending: "Joyfully accepts",
      guestCount: 1,
    });
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <section
        id="rsvp"
        ref={ref}
        className="py-24 sm:py-32 px-6 overflow-visible"
      >
        <div className="max-w-md mx-auto text-center">
          <div>
            <h2 className="font-script text-4xl text-foreground mb-6" data-testid="text-rsvp-success-title">
              Thank You!
            </h2>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-rsvp-success-message">
              🎉 We've received your RSVP and can't wait to celebrate with you.
            </p>
            <button
              onClick={handleReset}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground min-h-9 px-4 py-2 font-serif text-base tracking-wide"
              data-testid="button-submit-another"
            >
              Submit Another Response
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="rsvp"
      ref={ref}
      className="py-24 sm:py-32 px-6 overflow-visible"
    >
      <div className="max-w-md mx-auto">
        <h2
          className="font-script text-4xl sm:text-5xl text-center text-foreground mb-8 font-light tracking-wide"
          data-testid="text-rsvp-title"
        >
          RSVP
        </h2>

        <p
          className="font-sans text-base text-center text-muted-foreground mb-12 leading-relaxed"
          data-testid="text-rsvp-message"
        >
          Please respond by August 1, 2025
        </p>

        <div>
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-serif text-sm text-foreground">
                Full Name
              </label>
              <div className="flex gap-2">
                <input
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First"
                  required
                  className="flex h-9 w-full py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0 border-b-2 border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                  data-testid="input-first-name"
                />
                <input
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last"
                  required
                  className="flex h-9 w-full py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0 border-b-2 border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                  data-testid="input-last-name"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-serif text-sm text-foreground">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="flex h-9 w-full py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0 border-b-2 border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                data-testid="input-email"
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-serif text-sm text-foreground mb-4 block">
                Will you be attending?
              </label>
              <div className="flex gap-8">
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("Joyfully accepts")}
                    className={`attending-option aspect-square h-4 w-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${formData.attending === "Joyfully accepts" ? "border-primary" : "border-border"}`}
                    data-value="Joyfully accepts"
                  >
                    {formData.attending === "Joyfully accepts" && (
                      <span className="checkmark flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle h-2.5 w-2.5 fill-current text-current">
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                      </span>
                    )}
                  </button>
                  <label
                    onClick={() => handleRadioChange("Joyfully accepts")}
                    className="font-sans text-base text-foreground cursor-pointer"
                  >
                    Joyfully accepts
                  </label>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => handleRadioChange("Regretfully declines")}
                    className={`attending-option aspect-square h-4 w-4 rounded-full border focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${formData.attending === "Regretfully declines" ? "border-primary" : "border-border"}`}
                    data-value="Regretfully declines"
                  >
                    {formData.attending === "Regretfully declines" && (
                      <span className="checkmark flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-circle h-2.5 w-2.5 fill-current text-current">
                          <circle cx="12" cy="12" r="10"></circle>
                        </svg>
                      </span>
                    )}
                  </button>
                  <label
                    onClick={() => handleRadioChange("Regretfully declines")}
                    className="font-sans text-base text-foreground cursor-pointer"
                  >
                    Regretfully declines
                  </label>
                </div>
              </div>
              <input
                type="hidden"
                name="attending"
                value={formData.attending}
              />
            </div>

            <div className="space-y-2">
              <label className="font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70 font-serif text-sm text-foreground">
                Number of Guests
              </label>
              <input
                type="number"
                name="guestCount"
                min="1"
                max="10"
                value={formData.guestCount}
                onChange={handleGuestCountChange}
                className="flex h-9 w-full py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm border-0 border-b-2 border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                data-testid="input-guest-count"
              />
            </div>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover-elevate active-elevate-2 bg-primary text-primary-foreground border border-primary-border min-h-9 px-4 py-2 w-full font-serif text-base tracking-wide transition-colors duration-200 hover:bg-[hsl(75_13%_35%)]"
              data-testid="button-submit-rsvp"
            >
              Submit RSVP
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}