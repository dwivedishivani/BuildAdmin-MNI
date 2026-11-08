import type { CollectionConfig } from 'payload'

export const LoginHelpRequests: CollectionConfig = {
  slug: 'login-help-requests',
  admin: {
    useAsTitle: 'contactIdentifier',
    defaultColumns: ['contactIdentifier', 'issueType', 'status', 'createdAt'],
  },
  access: {
    read: ({ req }) => req.user?.collection === 'admins',
    create: () => true,
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'contactIdentifier',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
    },
    {
      name: 'phone',
      type: 'text',
    },
    {
      name: 'whatsapp',
      type: 'text',
    },
    {
      name: 'issueType',
      type: 'select',
      required: true,
      defaultValue: 'forgot_password',
      options: [
        { label: 'Request Access / Join Now', value: 'access_request' },
        { label: 'Forgot Password / Reset Access', value: 'forgot_password' },
        { label: 'Account Verification Pending', value: 'verification_pending' },
        { label: 'Account Locked / Inactive', value: 'account_locked' },
        { label: 'Request Admin Assisted Sign-In', value: 'admin_assisted' },
        { label: 'Other Access Inquiry', value: 'other' },
      ],
    },
    {
      name: 'details',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'pending',
      options: [
        { label: 'Pending Admin Review', value: 'pending' },
        { label: 'Assistance Dispatched', value: 'dispatched' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
  ],
}
