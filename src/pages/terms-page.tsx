import { Link } from 'react-router-dom'
import { APP_NAME, CONTACT_EMAIL } from '@/features/legal/legal-constants'
import { LegalLayout, LegalSection } from '@/layouts/legal-layout'

export function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <LegalSection title="The service">
        <p>
          {APP_NAME} finds subscriptions in your billing emails, tracks your spending and reminds you before
          renewals. By using it you agree to these terms and to our <Link to="/privacy">Privacy Policy</Link>. If you
          do not agree, please do not use the service.
        </p>
      </LegalSection>

      <LegalSection title="Your account">
        <p>
          You sign in with a Google account that you own. You are responsible for activity on your account and for
          keeping your Google account secure. You can disconnect Gmail or delete your account at any time in Settings.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>use the service for anything illegal, or to access someone else’s account or email;</li>
          <li>try to break, overload, scan or reverse engineer the service or get around its security;</li>
          <li>use bots or scrapers to access the service, or resell it without our permission.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Account termination">
        <p>
          You can stop using the service and delete your account at any time. We may suspend or close an account
          that breaks these terms or puts the service or other users at risk. We may also stop offering the service,
          and will try to give notice first.
        </p>
      </LegalSection>

      <LegalSection title="Disclaimer of warranties">
        <p>
          The service is provided “as is” and “as available”, without warranties of any kind. Subscriptions, prices
          and dates are worked out automatically from emails and may be incomplete or wrong. Always check important
          details with the provider or your bank. Reminders may arrive late or not at all.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of liability">
        <p>
          To the fullest extent the law allows, {APP_NAME} and its developer are not liable for any indirect,
          incidental or consequential loss, including missed cancellations, unexpected charges or lost data, arising
          from your use of the service. Our total liability for any claim is limited to the amount you paid us for the
          service, if any.
        </p>
      </LegalSection>

      <LegalSection title="Changes to these terms">
        <p>
          We may update these terms. When we do, we will change the date at the top of this page. If you keep using
          the service after a change, you accept the updated terms.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these terms: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
