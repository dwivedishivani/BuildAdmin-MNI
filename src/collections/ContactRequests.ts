import type { CollectionConfig } from 'payload'

export const ContactRequests: CollectionConfig = {
  slug: 'contact-requests',
  admin: {
    useAsTitle: 'id',
    defaultColumns: ['status', 'requestedByName', 'targetMemberName', 'createdAt'],
  },
  access: {
    read: () => true,
    create: () => true,
    update: () => true,
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'post',
      type: 'relationship',
      relationTo: 'posts',
    },
    {
      name: 'targetMember',
      type: 'relationship',
      relationTo: 'members',
    },
    {
      name: 'targetMemberName',
      type: 'text',
      required: true,
    },
    {
      name: 'targetMemberRole',
      type: 'text',
    },
    {
      name: 'targetMemberEmail',
      type: 'text',
    },
    {
      name: 'targetMemberPhone',
      type: 'text',
    },
    {
      name: 'requestedByName',
      type: 'text',
      defaultValue: 'Shivani Dwivedi',
    },
    {
      name: 'requestedByEmail',
      type: 'text',
      defaultValue: 'shivani@example.com',
    },
    {
      name: 'agendaNote',
      type: 'textarea',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending', value: 'pending' },
        { label: 'Contact Received', value: 'contact_received' },
        { label: 'Follow-up Required', value: 'followup_required' },
        { label: 'Outcome Recorded', value: 'outcome_recorded' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'followUp',
      type: 'group',
      fields: [
        {
          name: 'calledContact',
          type: 'checkbox',
        },
        {
          name: 'conversationTookPlace',
          type: 'checkbox',
        },
        {
          name: 'businessGenerated',
          type: 'checkbox',
        },
        {
          name: 'gaveBusiness',
          type: 'select',
          options: [
            { label: 'Gave business', value: 'gave' },
            { label: 'Did not give business', value: 'did_not_give' },
          ],
        },
        {
          name: 'remarks',
          type: 'textarea',
        },
        {
          name: 'recordedAt',
          type: 'date',
        },
      ],
    },
  ],
}
