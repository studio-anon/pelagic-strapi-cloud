import type { Schema, Struct } from '@strapi/strapi';

export interface SectionsApplications extends Struct.ComponentSchema {
  collectionName: 'components_sections_applications';
  info: {
    description: 'Applications grid';
    displayName: 'Applications';
    icon: 'apps';
  };
  attributes: {
    applications: Schema.Attribute.Component<'shared.application-card', true>;
    title: Schema.Attribute.String;
  };
}

export interface SectionsContact extends Struct.ComponentSchema {
  collectionName: 'components_sections_contacts';
  info: {
    description: 'Contact section with blocks';
    displayName: 'Contact';
    icon: 'envelope';
  };
  attributes: {
    blocks: Schema.Attribute.Component<'shared.contact-block', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsFaqs extends Struct.ComponentSchema {
  collectionName: 'components_sections_faqs';
  info: {
    description: 'Frequently asked questions section';
    displayName: 'FAQs';
    icon: 'question';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.faq-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsHero extends Struct.ComponentSchema {
  collectionName: 'components_sections_heros';
  info: {
    description: 'Homepage hero section';
    displayName: 'Hero';
    icon: 'sun';
  };
  attributes: {
    desktopHeroImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    desktopSupportImages: Schema.Attribute.Media<'images', true>;
    heroCopy: Schema.Attribute.Text & Schema.Attribute.Required;
    mobileHeroImage: Schema.Attribute.Media<'images'>;
    mobileSupportImages: Schema.Attribute.Media<'images', true>;
  };
}

export interface SectionsImpact extends Struct.ComponentSchema {
  collectionName: 'components_sections_impacts';
  info: {
    description: 'Impact callout and testimonial';
    displayName: 'Impact';
    icon: 'chart';
  };
  attributes: {
    calloutLabel: Schema.Attribute.String;
    calloutNumber: Schema.Attribute.String;
    description: Schema.Attribute.RichText;
    testimonialName: Schema.Attribute.String;
    testimonialQuote: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsMilanDesignWeek extends Struct.ComponentSchema {
  collectionName: 'components_sections_milan_design_weeks';
  info: {
    description: 'Promo section for Milan Design Week';
    displayName: 'Milan Design Week';
    icon: 'calendar';
  };
  attributes: {
    buttonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    buttonUrl: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.RichText;
    thumbnail: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    video: Schema.Attribute.Media<'videos'>;
  };
}

export interface SectionsMission extends Struct.ComponentSchema {
  collectionName: 'components_sections_missions';
  info: {
    description: 'Mission statement section';
    displayName: 'Mission';
    icon: 'compass';
  };
  attributes: {
    body: Schema.Attribute.RichText;
    taglineText: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsOverview extends Struct.ComponentSchema {
  collectionName: 'components_sections_overviews';
  info: {
    description: 'Overview section with repeatable items';
    displayName: 'Overview';
    icon: 'list';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    items: Schema.Attribute.Component<'shared.overview-item', true>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsProduct extends Struct.ComponentSchema {
  collectionName: 'components_sections_products';
  info: {
    description: 'Product call-to-action block';
    displayName: 'Product CTA';
    icon: 'cart';
  };
  attributes: {
    buttonAction: Schema.Attribute.Enumeration<
      ['openModal', 'internalLink', 'externalLink']
    > &
      Schema.Attribute.Required;
    buttonLabel: Schema.Attribute.String & Schema.Attribute.Required;
    description: Schema.Attribute.RichText;
    externalUrl: Schema.Attribute.String;
    internalLink: Schema.Attribute.Relation<
      'oneToOne',
      'api::journal-article.journal-article'
    >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SectionsSmallGallery extends Struct.ComponentSchema {
  collectionName: 'components_sections_small_galleries';
  info: {
    description: 'Small gallery with responsive images';
    displayName: 'Small gallery';
    icon: 'images';
  };
  attributes: {
    items: Schema.Attribute.Component<'shared.responsive-image', true>;
  };
}

export interface SharedApplicationCard extends Struct.ComponentSchema {
  collectionName: 'components_shared_application_cards';
  info: {
    description: 'Card for applications grid';
    displayName: 'Application card';
    icon: 'grid';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedContactBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_contact_blocks';
  info: {
    description: 'Contact entry with description and optional link';
    displayName: 'Contact block';
    icon: 'user';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    email: Schema.Attribute.Email;
    externalLink: Schema.Attribute.Component<'shared.external-link', false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedExternalLink extends Struct.ComponentSchema {
  collectionName: 'components_shared_external_links';
  info: {
    description: 'Reusable external link with optional new tab';
    displayName: 'External link';
    icon: 'link';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedFaqItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_faq_items';
  info: {
    description: 'Question and answer pair';
    displayName: 'FAQ item';
    icon: 'question';
  };
  attributes: {
    answer: Schema.Attribute.RichText;
    email: Schema.Attribute.String;
    question: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedImagePair extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_pairs';
  info: {
    description: 'Side-by-side images with optional caption';
    displayName: 'Image pair';
    icon: 'images';
  };
  attributes: {
    caption: Schema.Attribute.String;
    left_image: Schema.Attribute.Media<'images'>;
    right_image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedImageText extends Struct.ComponentSchema {
  collectionName: 'components_shared_image_texts';
  info: {
    description: 'Image with aligned text';
    displayName: 'Image + text';
    icon: 'picture';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['imageLeft', 'imageRight']> &
      Schema.Attribute.DefaultTo<'imageLeft'>;
    body: Schema.Attribute.RichText;
    image: Schema.Attribute.Media<'images'>;
    title: Schema.Attribute.String;
  };
}

export interface SharedMediaBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_media_blocks';
  info: {
    description: 'Full-width image with caption';
    displayName: 'Media block';
    icon: 'image';
  };
  attributes: {
    caption: Schema.Attribute.String;
    image: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedOverviewItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_overview_items';
  info: {
    description: 'Title + description item for overview sections';
    displayName: 'Overview item';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.RichText;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedResponsiveImage extends Struct.ComponentSchema {
  collectionName: 'components_shared_responsive_images';
  info: {
    description: 'Desktop and mobile image variants';
    displayName: 'Responsive image';
    icon: 'picture';
  };
  attributes: {
    desktopImage: Schema.Attribute.Media<'images'>;
    mobileImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: 'Rich text content block';
    displayName: 'Rich text';
    icon: 'alignLeft';
  };
  attributes: {
    content: Schema.Attribute.RichText;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    description: 'SEO metadata';
    displayName: 'SEO';
    icon: 'search';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text & Schema.Attribute.Required;
    metaTitle: Schema.Attribute.String & Schema.Attribute.Required;
    shareImage: Schema.Attribute.Media<'images'>;
  };
}

export interface SharedVideoBlock extends Struct.ComponentSchema {
  collectionName: 'components_shared_video_blocks';
  info: {
    description: 'Video with optional thumbnail and caption';
    displayName: 'Video block';
    icon: 'video';
  };
  attributes: {
    caption: Schema.Attribute.String;
    thumbnail: Schema.Attribute.Media<'images'>;
    videoMedia: Schema.Attribute.Media<'videos'>;
    videoUrl: Schema.Attribute.String;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'sections.applications': SectionsApplications;
      'sections.contact': SectionsContact;
      'sections.faqs': SectionsFaqs;
      'sections.hero': SectionsHero;
      'sections.impact': SectionsImpact;
      'sections.milan-design-week': SectionsMilanDesignWeek;
      'sections.mission': SectionsMission;
      'sections.overview': SectionsOverview;
      'sections.product': SectionsProduct;
      'sections.small-gallery': SectionsSmallGallery;
      'shared.application-card': SharedApplicationCard;
      'shared.contact-block': SharedContactBlock;
      'shared.external-link': SharedExternalLink;
      'shared.faq-item': SharedFaqItem;
      'shared.image-pair': SharedImagePair;
      'shared.image-text': SharedImageText;
      'shared.media-block': SharedMediaBlock;
      'shared.overview-item': SharedOverviewItem;
      'shared.responsive-image': SharedResponsiveImage;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.video-block': SharedVideoBlock;
    }
  }
}
