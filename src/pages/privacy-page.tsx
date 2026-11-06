import { Link } from 'react-router-dom'
import {
  APP_NAME,
  CONTACT_EMAIL,
  GOOGLE_PERMISSIONS_URL,
  GOOGLE_USER_DATA_POLICY_URL,
} from '@/features/legal/legal-constants'
import { LegalLayout, LegalSection } from '@/layouts/legal-layout'

function ContactLink() {
  return <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
}

export function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <LegalSection title="Who we are">
        <p>
          {APP_NAME} (“we”, “us”) is a web app at subscriptionmaster.app that finds your paid subscriptions in
          your billing emails, tracks what you spend and reminds you before each renewal. This policy explains
          what data we access, why, and the choices you have. Questions go to <ContactLink />.
        </p>
      </LegalSection>

      <LegalSection title="Google data we access and why">
        <p>You sign in with your Google account. We ask Google for these permissions only:</p>
        <ul>
          <li>
            <strong>Basic profile (openid, email, profile).</strong> Your Google account ID, email address, name
            and profile picture. We use them to create your account, sign you in and show who is signed in.
          </li>
          <li>
            <strong>Read your Gmail (gmail.readonly).</strong> We search your inbox for billing emails, such as
            receipts, invoices, renewal notices and trial reminders, from up to 13 months back. From them we work
            out your subscriptions, prices, billing dates and payment history. We do not use this access to read
            personal emails for any other purpose.
          </li>
          <li>
            <strong>Send email as you (gmail.send).</strong> We send payment reminders from your Gmail address to
            that same address. We never send email to anyone else.
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="What we store">
        <ul>
          <li>Account: Google account ID, email, name, profile picture link, time zone and role.</li>
          <li>
            Google access: a refresh token that lets the app sync your Gmail, encrypted with AES-256-GCM. Short-lived
            access tokens are kept only in memory for up to one hour and are never written to the database.
          </li>
          <li>
            Billing email details: sender, subject, date, Gmail message ID and the facts we extract, such as amount,
            currency, billing date and invoice or customer reference. We do not store email bodies or attachments;
            when you open one in the app, it is fetched from Gmail at that moment.
          </li>
          <li>
            Subscriptions and payments: service name, price, currency, billing cycle, dates, category and, when the
            email shows it, the card brand and last four digits. We never see or store full card numbers.
          </li>
          <li>
            Sign-in activity: time, IP address, browser user agent and the approximate city and country of that IP
            address. We use it to protect your account.
          </li>
          <li>Notifications you receive, your reminder settings and, if you turn them on, browser push subscriptions.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How we use your data">
        <p>
          We use your data only to provide and improve the features you see in {APP_NAME}: finding and tracking
          subscriptions, showing spending reports, sending the reminders you ask for and keeping your account
          secure. We do not sell your data, use it for advertising, or use it to train AI or machine learning models.
        </p>
      </LegalSection>

      <LegalSection title="How we store and protect it">
        <ul>
          <li>Data is stored in a PostgreSQL database on Amazon Web Services (AWS) and the app runs on AWS servers.</li>
          <li>All traffic between your browser and the app is encrypted with HTTPS.</li>
          <li>Google refresh tokens are encrypted at rest; our own session tokens are stored only as hashes.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Who we share data with">
        <p>We do not sell or rent your data. We share it only with services needed to run the app:</p>
        <ul>
          <li>
            <strong>Google</strong>: for sign-in, reading billing emails, sending your reminders and revoking access
            when you disconnect.
          </li>
          <li>
            <strong>Amazon Web Services</strong>: hosting and database.
          </li>
          <li>
            <strong>ip-api.com</strong>: receives your IP address when you sign in, to look up the approximate city
            and country.
          </li>
          <li>
            <strong>Your browser’s push service</strong> (for example Google, Mozilla or Apple): delivers reminder
            notifications if you enable browser push.
          </li>
        </ul>
        <p>We may also disclose data if required by law, or to protect the security of the app and its users.</p>
      </LegalSection>

      <LegalSection title="Google API Services User Data Policy">
        <p>
          {APP_NAME}’s use and transfer to any other app of information received from Google APIs will adhere to
          the{' '}
          <a href={GOOGLE_USER_DATA_POLICY_URL} target="_blank" rel="noreferrer">
            Google API Services User Data Policy
          </a>
          , including the Limited Use requirements. In particular:
        </p>
        <ul>
          <li>We use Gmail data only to provide the subscription-tracking and reminder features described above.</li>
          <li>We do not transfer Gmail data to others except as needed to provide those features, to comply with law, or as part of a merger or acquisition with notice to you.</li>
          <li>We do not use or transfer Gmail data for advertising, including personalised or retargeted ads.</li>
          <li>We do not sell Gmail data, and we do not use it to determine credit-worthiness or for lending.</li>
          <li>
            No person reads your Gmail data unless you give clear permission (for example, when you ask for help with
            a specific email), it is needed for security purposes such as investigating abuse, it is needed to comply
            with law, or the data is aggregated and anonymised for internal operations.
          </li>
          <li>We do not use Gmail data to develop, improve or train generalised AI or machine learning models.</li>
        </ul>
      </LegalSection>

      <LegalSection title="How long we keep data">
        <p>
          We keep your data while your account exists. When you disconnect Gmail or delete your account, the related
          data is deleted from our database straight away, as described below.
        </p>
      </LegalSection>

      <LegalSection title="Deleting your data and revoking access">
        <ul>
          <li>
            <strong>Disconnect Gmail and delete my data</strong> (Settings → Danger zone): revokes our Google access
            and deletes your Gmail connection, billing email details, subscriptions, payments and notifications.
          </li>
          <li>
            <strong>Delete account</strong> (Settings → Danger zone): does all of the above and also deletes your
            account, sign-in activity and settings.
          </li>
          <li>
            You can also email <ContactLink /> from your account’s address to ask us to delete your data.
          </li>
          <li>
            You can remove {APP_NAME}’s access to your Google account at any time at{' '}
            <a href={GOOGLE_PERMISSIONS_URL} target="_blank" rel="noreferrer">
              myaccount.google.com/permissions
            </a>
            .
          </li>
        </ul>
      </LegalSection>

      <LegalSection title="Children">
        <p>{APP_NAME} is not meant for children under 16, and we do not knowingly collect their data.</p>
      </LegalSection>

      <LegalSection title="Changes to this policy">
        <p>
          If we change this policy, we will update the date at the top of this page. If the change affects how we use
          Google data, we will ask for your consent again before it applies. See also our{' '}
          <Link to="/terms">Terms of Service</Link>.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions or requests about your privacy: <ContactLink />.
        </p>
      </LegalSection>
    </LegalLayout>
  )
}
