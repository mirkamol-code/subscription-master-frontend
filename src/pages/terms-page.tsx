import { Link } from 'react-router-dom'
import { APP_NAME, CONTACT_EMAIL } from '@/features/legal/legal-constants'
import { LegalLayout, LegalSection } from '@/layouts/legal-layout'

function ContactLink() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
}

export function TermsPage() {
  return (
    <LegalLayout title="Terms of Service">
      <LegalSection title="Acceptance of these terms">
        <p>
          By signing in to or using {APP_NAME} at subscriptionmaster.app, you agree to these terms. If you do not
          agree, please do not use the service.
        </p>
      </LegalSection>

      <LegalSection title="The service">
        <p>
          {APP_NAME} finds paid subscriptions in your billing emails, tracks what you spend and reminds you before
          renewals. The service is currently free to use.
        </p>
      </LegalSection>

      <LegalSection title="Your account and signing in with Google">
        <p>
          You sign in with a Google account that you own. With your permission, the app reads billing emails in your
          Gmail and sends payment reminders from your Gmail address to yourself. You are responsible for activity on
          your account and for keeping your Google account secure.
        </p>
      </LegalSection>

      <LegalSection title="Acceptable use">
        <p>You agree not to:</p>
        <ul>
          <li>use the service for anything illegal, or to access someone else’s account or email;</li>
          <li>abuse, overload, scan or reverse engineer the service, or try to get around its security;</li>
          <li>use bots or scrapers to access the service, or resell it without our permission.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Your content">
        <p>
          Subscriptions and details you add or edit in the app stay yours. You give us permission to store and
          process them only to run the service for you. They are not shown to other users.
        </p>
      </LegalSection>

      <LegalSection title="Termination">
        <ul>
          <li>We may suspend or close an account that breaks these terms or puts the service or other users at risk.</li>
          <li>
            You can stop using the service at any time. You can delete your account yourself in Settings, or ask us
            to delete it by emailing <ContactLink />.
          </li>
          <li>We may stop offering the service, and will try to give notice first.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Privacy">
        <p>
          How we collect, use and protect your data, including data from Google, is described in our{' '}
          <Link to="/privacy">Privacy Policy</Link>.
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
          Questions about these terms: <ContactLink />.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
