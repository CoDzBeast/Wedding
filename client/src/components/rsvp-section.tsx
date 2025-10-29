import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { insertRsvpSchema, type InsertRsvp } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function RsvpSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<InsertRsvp>({
    resolver: zodResolver(insertRsvpSchema),
    defaultValues: {
      name: "",
      email: "",
      attending: true,
      guestCount: 1,
      dietaryRestrictions: "",
      message: "",
    },
  });

  const rsvpMutation = useMutation({
    mutationFn: async (data: InsertRsvp) => {
      return await apiRequest("POST", "/api/rsvp", data);
    },
    onSuccess: () => {
      setSubmitted(true);
      form.reset();
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "Failed to submit RSVP",
        description: error.message || "Please try again later.",
      });
    },
  });

  const onSubmit = async (data: InsertRsvp) => {
    rsvpMutation.mutate(data);
  };

  if (submitted) {
    return (
      <section
        id="rsvp"
        ref={ref}
        className="py-24 sm:py-32 px-6 bg-card"
      >
        <div className="max-w-md mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="font-serif text-4xl text-foreground mb-6" data-testid="text-rsvp-success-title">
              Thank You!
            </h2>
            <p className="font-sans text-lg text-muted-foreground leading-relaxed mb-8" data-testid="text-rsvp-success-message">
              We've received your RSVP and can't wait to celebrate with you.
            </p>
            <Button
              variant="outline"
              onClick={() => setSubmitted(false)}
              data-testid="button-submit-another"
            >
              Submit Another Response
            </Button>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="rsvp"
      ref={ref}
      className="py-24 sm:py-32 px-6 bg-card"
    >
      <div className="max-w-md mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="font-serif text-4xl sm:text-5xl text-center text-foreground mb-8 font-light tracking-wide"
          data-testid="text-rsvp-title"
        >
          RSVP
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-sans text-base text-center text-muted-foreground mb-12 leading-relaxed"
          data-testid="text-rsvp-message"
        >
          Please respond by August 1, 2025
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif text-sm text-foreground">
                      Full Name
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        className="border-0 border-b border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        data-testid="input-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif text-sm text-foreground">
                      Email Address
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="email"
                        className="border-0 border-b border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                        data-testid="input-email"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="attending"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif text-sm text-foreground mb-4 block">
                      Will you be attending?
                    </FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={(value) => field.onChange(value === "true")}
                        defaultValue={field.value ? "true" : "false"}
                        className="flex gap-8"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="true" id="attending-yes" data-testid="radio-attending-yes" />
                          <label
                            htmlFor="attending-yes"
                            className="font-sans text-base text-foreground cursor-pointer"
                          >
                            Joyfully accepts
                          </label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="false" id="attending-no" data-testid="radio-attending-no" />
                          <label
                            htmlFor="attending-no"
                            className="font-sans text-base text-foreground cursor-pointer"
                          >
                            Regretfully declines
                          </label>
                        </div>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("attending") && (
                <>
                  <FormField
                    control={form.control}
                    name="guestCount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-sm text-foreground">
                          Number of Guests
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min="1"
                            max="10"
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            className="border-0 border-b border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                            data-testid="input-guest-count"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dietaryRestrictions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-serif text-sm text-foreground">
                          Dietary Restrictions (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            className="border-0 border-b border-border rounded-none bg-transparent px-0 font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors"
                            data-testid="input-dietary"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="font-serif text-sm text-foreground">
                      Message to the Couple (Optional)
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        rows={4}
                        className="border border-border rounded-md bg-transparent font-sans focus-visible:ring-0 focus-visible:border-primary transition-colors resize-none"
                        data-testid="input-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full font-serif text-base tracking-wide"
                disabled={rsvpMutation.isPending}
                data-testid="button-submit-rsvp"
              >
                {rsvpMutation.isPending ? "Submitting..." : "Submit RSVP"}
              </Button>
            </form>
          </Form>
        </motion.div>
      </div>
    </section>
  );
}
