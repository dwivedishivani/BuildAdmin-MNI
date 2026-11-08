import type { CollectionConfig, Access } from 'payload'

const isAdmin: Access = ({ req }) => req.user?.collection === 'admins'

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'status', 'submittedByName', 'createdAt'],
  },
  access: {
    read: isAdmin,
    create: () => true, // Member submissions are created through the narrow submission endpoint.
    update: isAdmin,
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Profile Update', value: 'Profile Update' },
        { label: 'Business Requirement', value: 'Business Requirement' },
        { label: 'Vendor / Supplier Needed', value: 'Vendor / Supplier Needed' },
        { label: 'Business Opportunity', value: 'Business Opportunity' },
        { label: 'Offer / Announcement', value: 'Offer / Announcement' },
      ],
      defaultValue: 'Business Requirement',
    },
    {
      name: 'description',
      type: 'textarea',
      required: true,
    },
    {
      name: 'profileChanges',
      type: 'textarea',
      admin: {
        description: 'Formatted summary or JSON of updated profile fields',
      },
    },
    {
      name: 'submittedByName',
      type: 'text',
      defaultValue: 'Shivani Dwivedi',
    },
    {
      name: 'submittedByEmail',
      type: 'email',
      defaultValue: 'shivani@example.com',
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      relationTo: 'members',
    },
    {
      name: 'supportingImage',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'supportingImageUrl',
      type: 'text',
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      options: [
        { label: 'Pending Approval', value: 'pending' },
        { label: 'Changes Requested', value: 'changes_requested' },
        { label: 'Approved', value: 'approved' },
        { label: 'Published to Timeline', value: 'published' },
        { label: 'Rejected', value: 'rejected' },
      ],
      defaultValue: 'pending',
    },
    {
      name: 'adminFeedback',
      type: 'textarea',
    },
    {
      name: 'associatedPost',
      type: 'relationship',
      relationTo: 'posts',
    },
  ],
}
