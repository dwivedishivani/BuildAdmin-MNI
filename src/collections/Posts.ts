import type { CollectionConfig } from 'payload'

export const Posts: CollectionConfig = {
  slug: 'posts',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'postType', 'category', 'isPublished', 'publishedAt'],
  },
  access: {
    read: () => true,
    create: ({ req }) => req.user?.collection === 'admins',
    update: ({ req }) => req.user?.collection === 'admins',
    delete: ({ req }) => req.user?.collection === 'admins',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'postType',
      type: 'select',
      required: true,
      options: [
        { label: 'Image Only Creative', value: 'image_only' },
        { label: 'Text Only Announcement', value: 'text_only' },
        { label: 'Image + Text Bulletin', value: 'image_text' },
      ],
      defaultValue: 'image_text',
    },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Opportunity', value: 'Opportunity' },
        { label: 'Requirement', value: 'Requirement' },
        { label: 'Announcement', value: 'Announcement' },
        { label: 'Promotion', value: 'Promotion' },
        { label: 'Member Spotlight', value: 'Member Spotlight' },
        { label: 'Community Meetup', value: 'Community Meetup' },
      ],
      defaultValue: 'Opportunity',
    },
    {
      name: 'badgeText',
      type: 'text',
    },
    {
      name: 'content',
      type: 'textarea',
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'imageUrlFallback',
      type: 'text',
      admin: {
        description: 'Optional direct external image link for starter images',
      },
    },
    {
      name: 'taggedMember',
      type: 'relationship',
      relationTo: 'members',
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'isPublished',
      type: 'checkbox',
      defaultValue: true,
    },
    {
      name: 'isArchived',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'displayOrder',
      type: 'number',
      defaultValue: 0,
    },
  ],
}
