import type { CollectionConfig } from 'payload'

export const Members: CollectionConfig = {
  slug: 'members',
  admin: {
    useAsTitle: 'fullName',
    defaultColumns: ['fullName', 'email', 'businessName', 'city', 'isVerified'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'admins',
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'fullName',
      type: 'text',
      required: true,
    },
    {
      name: 'email',
      type: 'email',
      required: true,
      unique: true,
    },
    {
      name: 'phone',
      type: 'text',
      required: true,
    },
    {
      name: 'city',
      type: 'text',
      required: true,
      defaultValue: 'Bengaluru, India',
    },
    {
      name: 'memberId',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'memberSince',
      type: 'text',
      defaultValue: 'October 2024',
    },
    {
      name: 'businessName',
      type: 'text',
      required: true,
    },
    {
      name: 'businessCategory',
      type: 'text',
      required: true,
    },
    {
      name: 'bio',
      type: 'textarea',
      required: true,
    },
    {
      name: 'tier',
      type: 'select',
      defaultValue: 'pro',
      options: [
        { label: 'Starter Member', value: 'starter' },
        { label: 'Pro Member', value: 'pro' },
        { label: 'Premium Member', value: 'premium' },
      ],
    },
    {
      name: 'avatarInitials',
      type: 'text',
      required: true,
    },
    {
      name: 'isVerified',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'mniCoins',
      type: 'number',
      defaultValue: 500,
      admin: {
        description: 'Gamified MNI credits (500 coins earned per verified referral, redeemable for Meetup prizes)',
      },
    },
    {
      name: 'referralCount',
      type: 'number',
      defaultValue: 0,
    },
    {
      name: 'referralCode',
      type: 'text',
    },
    {
      name: 'whatWeDo',
      type: 'textarea',
      admin: {
        description: 'What exactly do you do? (Briefly describe business, expertise, and what you offer)',
      },
    },
    {
      name: 'keyProductService',
      type: 'textarea',
      admin: {
        description: 'Key product or service main offering you would like MNI members to know about',
      },
    },
    {
      name: 'idealClient',
      type: 'textarea',
      admin: {
        description: 'Ideal client or customer you would like to connect with',
      },
    },
    {
      name: 'opportunityLookingFor',
      type: 'textarea',
      admin: {
        description: 'Business opportunity, referral or support you are looking for right now',
      },
    },
    {
      name: 'targetConnections',
      type: 'text',
      admin: {
        description: 'Specific person, profession, company or connection you would like to meet',
      },
    },
    {
      name: 'preferredCallDay',
      type: 'select',
      defaultValue: 'Wednesday',
      options: [
        { label: 'Monday', value: 'Monday' },
        { label: 'Tuesday', value: 'Tuesday' },
        { label: 'Wednesday', value: 'Wednesday' },
        { label: 'Thursday', value: 'Thursday' },
        { label: 'Friday', value: 'Friday' },
        { label: 'Saturday', value: 'Saturday' },
        { label: 'Sunday', value: 'Sunday' },
      ],
    },
    {
      name: 'preferredCallTime',
      type: 'select',
      defaultValue: '11:00 AM - 1:00 PM',
      options: [
        { label: '9:00 AM - 11:00 AM', value: '9:00 AM - 11:00 AM' },
        { label: '11:00 AM - 1:00 PM', value: '11:00 AM - 1:00 PM' },
        { label: '1:00 PM - 3:00 PM', value: '1:00 PM - 3:00 PM' },
        { label: '3:00 PM - 5:00 PM', value: '3:00 PM - 5:00 PM' },
        { label: '5:00 PM - 7:00 PM', value: '5:00 PM - 7:00 PM' },
        { label: '7:00 PM - 9:00 PM', value: '7:00 PM - 9:00 PM' },
      ],
    },
    {
      name: 'websiteUrl',
      type: 'text',
      defaultValue: 'www.anotherworldindia.com',
    },
    {
      name: 'additionalNotes',
      type: 'textarea',
    },
    {
      name: 'avatarImage',
      type: 'upload',
      relationTo: 'media',
    },
  ],
}
