import type { CollectionConfig } from 'payload'

export const Referrals: CollectionConfig = {
  slug: 'referrals',
  admin: {
    useAsTitle: 'candidateName',
    defaultColumns: ['candidateName', 'candidateEmail', 'status', 'coinsAwarded', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'candidateName',
      type: 'text',
      required: true,
    },
    {
      name: 'candidatePhone',
      type: 'text',
      required: true,
    },
    {
      name: 'candidateEmail',
      type: 'email',
      required: true,
    },
    {
      name: 'context',
      type: 'textarea',
    },
    {
      name: 'referrerMember',
      type: 'relationship',
      relationTo: 'members',
    },
    {
      name: 'referrerName',
      type: 'text',
      defaultValue: 'Shivani Dwivedi',
    },
    {
      name: 'referrerEmail',
      type: 'email',
      defaultValue: 'shivani@example.com',
    },
    {
      name: 'coinsAwarded',
      type: 'number',
      defaultValue: 500,
    },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'confirmed',
      options: [
        { label: 'Under Review', value: 'pending_review' },
        { label: 'Confirmed (500 MNI Coins Credited)', value: 'confirmed' },
        { label: 'Redeemed in Meetup', value: 'meetup_redeemed' },
      ],
    },
  ],
}
