export default function TermsPage() {
  return (
    <section className="pt-28 md:pt-36 pb-12">
      <div className="container max-w-3xl">
        <h1 className="text-3xl md:text-4xl font-black mb-6">Terms & Conditions</h1>
        
        <div className="space-y-8 text-sm md:text-base leading-relaxed">
          <p className="text-muted-foreground">
            These Terms & Conditions govern your access to and use of the SAILX platform, tools, and booking services. By using our platform, you acknowledge and agree to these terms:
          </p>

          <div>
            <h2 className="text-xl font-bold mb-3">
              Use of Services
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>Your account is personal, confidential, and completely non-transferable.</li>
              <li>You agree not to misuse, exploit, or attempt to disrupt any of our platform’s services or backend databases.</li>
              <li>Any fraudulent activity will lead to immediate termination of access without prior warning.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              Bookings & Payments
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>All bookings submitted via the platform are subject to real-time seat availability and explicit tour organizer confirmation.</li>
              <li>Standard payment schedules, cancellation fees, and refund policies apply strictly as outlined in their respective policy pages.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-bold mb-3">
              Liability & Disclaimers
            </h2>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
              <li>SAILX acts strictly as an on-ground trade and business facilitation agent between buyers, tour organizers, and suppliers.</li>
              <li>We are not responsible or liable for any indirect, incidental, or third-party losses incurred during travels, tours, or business operations.</li>
              <li>All business transactions, agreements, and contracts negotiated with external suppliers are the sole responsibility of the respective parties.</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
