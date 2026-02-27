import type { Schema, Struct } from '@strapi/strapi';

export interface JournalBreakoutText extends Struct.ComponentSchema {
  collectionName: 'components_journal_breakout_texts';
  info: {
    description: 'Highlighted standalone copy block';
    displayName: 'Breakout text';
    icon: 'quote';
  };
  attributes: {
    copy: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface JournalFullWidthImage extends Struct.ComponentSchema {
  collectionName: 'components_journal_full_width_images';
  info: {
    description: 'Responsive full-width article image';
    displayName: 'Full width image';
    icon: 'landscape';
  };
  attributes: {
    desktopImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    mobileImage: Schema.Attribute.Media<'images'>;
  };
}

export interface JournalSingleColumn extends Struct.ComponentSchema {
  collectionName: 'components_journal_single_columns';
  info: {
    description: 'Single-column article copy';
    displayName: 'Single column';
    icon: 'alignLeft';
  };
  attributes: {
    copy: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface JournalTextImagePairLeft extends Struct.ComponentSchema {
  collectionName: 'components_journal_text_image_pair_lefts';
  info: {
    description: 'Copy with accompanying image, left-aligned layout';
    displayName: 'Text image pair left';
    icon: 'picture';
  };
  attributes: {
    copy: Schema.Attribute.RichText & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface JournalTextImagePairRight extends Struct.ComponentSchema {
  collectionName: 'components_journal_text_image_pair_rights';
  info: {
    description: 'Copy with accompanying image, right-aligned layout';
    displayName: 'Text image pair right';
    icon: 'picture';
  };
  attributes: {
    copy: Schema.Attribute.RichText & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface JournalTwoColumn extends Struct.ComponentSchema {
  collectionName: 'components_journal_two_columns';
  info: {
    description: 'Two-column article copy';
    displayName: 'Two column';
    icon: 'layout';
  };
  attributes: {
    copy01: Schema.Attribute.RichText & Schema.Attribute.Required;
    copy02: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface JournalTwoImages extends Struct.ComponentSchema {
  collectionName: 'components_journal_two_images';
  info: {
    description: 'Two-image block with desktop and mobile variants';
    displayName: 'Two images';
    icon: 'apps';
  };
  attributes: {
    desktopImage01: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    desktopImage02: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    mobileImage01: Schema.Attribute.Media<'images'>;
    mobileImage02: Schema.Attribute.Media<'images'>;
  };
}

export interface JournalVideoEmbed extends Struct.ComponentSchema {
  collectionName: 'components_journal_video_embeds';
  info: {
    description: 'Embedded video URL with desktop/mobile poster images';
    displayName: 'Video embed';
    icon: 'play';
  };
  attributes: {
    desktopImage: Schema.Attribute.Media<'images'>;
    mobileImage: Schema.Attribute.Media<'images'>;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsCalculatorConfig extends Struct.ComponentSchema {
  collectionName: 'components_products_calculator_configs';
  info: {
    description: 'Calculator labels and numeric constants';
    displayName: 'Calculator config';
    icon: 'calculator';
  };
  attributes: {
    defaultValue: Schema.Attribute.Decimal;
    inputLabel: Schema.Attribute.String;
    maximumValue: Schema.Attribute.Decimal;
    minimumValue: Schema.Attribute.Decimal;
    modeLabel: Schema.Attribute.String;
    multiplier: Schema.Attribute.Decimal;
    outputLabel: Schema.Attribute.String;
    stepValue: Schema.Attribute.Decimal;
    unitLabel: Schema.Attribute.String;
  };
}

export interface ProductsClosingQuoteImpactCta extends Struct.ComponentSchema {
  collectionName: 'components_products_closing_quote_impact_ctas';
  info: {
    description: 'Closing quote section with CTA and paired imagery';
    displayName: 'Closing quote impact CTA';
    icon: 'quote';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    cta: Schema.Attribute.Component<'shared.cta', false> &
      Schema.Attribute.Required;
    headline: Schema.Attribute.Text & Schema.Attribute.Required;
    primaryImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    secondaryImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
  };
}

export interface ProductsClosingQuoteSimple extends Struct.ComponentSchema {
  collectionName: 'components_products_closing_quote_simples';
  info: {
    description: 'Simple closing quote section';
    displayName: 'Closing quote simple';
    icon: 'quote';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    quote: Schema.Attribute.Text & Schema.Attribute.Required;
    subcopy: Schema.Attribute.Text;
  };
}

export interface ProductsComparisonRow extends Struct.ComponentSchema {
  collectionName: 'components_products_comparison_rows';
  info: {
    description: 'Single row in ProductComparison table';
    displayName: 'Comparison row';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    leftValue: Schema.Attribute.String & Schema.Attribute.Required;
    rightValue: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsConfiguratorDefaults extends Struct.ComponentSchema {
  collectionName: 'components_products_configurator_defaults';
  info: {
    description: 'Default option IDs for configurator';
    displayName: 'Configurator defaults';
    icon: 'check';
  };
  attributes: {
    calculatorMode: Schema.Attribute.String;
    colourId: Schema.Attribute.String & Schema.Attribute.Required;
    designId: Schema.Attribute.String & Schema.Attribute.Required;
    sizeId: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsContainerStatement extends Struct.ComponentSchema {
  collectionName: 'components_products_container_statements';
  info: {
    description: 'Mod.factory container statement section';
    displayName: 'Container statement';
    icon: 'picture';
  };
  attributes: {
    desktopMainImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    desktopSideImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    mobileMainImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    mobileSideImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
  };
}

export interface ProductsDeployStep extends Struct.ComponentSchema {
  collectionName: 'components_products_deploy_steps';
  info: {
    description: 'Deployment step item';
    displayName: 'Deploy step';
    icon: 'walk';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    number: Schema.Attribute.Integer & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsDeploySteps extends Struct.ComponentSchema {
  collectionName: 'components_products_deploy_steps_sections';
  info: {
    description: 'Mod.factory deploy steps section';
    displayName: 'Deploy steps';
    icon: 'walk';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    bottomCopyBlocks: Schema.Attribute.Component<
      'products.rich-copy-block',
      true
    > &
      Schema.Attribute.SetMinMax<
        {
          max: 3;
          min: 0;
        },
        number
      >;
    bottomCta: Schema.Attribute.Component<'shared.cta', false>;
    intro: Schema.Attribute.Text;
    steps: Schema.Attribute.Component<'products.deploy-step', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsFactoryTarget extends Struct.ComponentSchema {
  collectionName: 'components_products_factory_targets';
  info: {
    description: 'Factory target statement section';
    displayName: 'Factory target';
    icon: 'target';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    desktopImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    mobileImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    statement: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ProductsFeaturedIn extends Struct.ComponentSchema {
  collectionName: 'components_products_featured_ins';
  info: {
    description: 'Featured outlets section';
    displayName: 'Featured in';
    icon: 'star';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    mode: Schema.Attribute.Enumeration<['logos', 'text']> &
      Schema.Attribute.Required;
    outlets: Schema.Attribute.Component<'products.outlet-logo', true>;
    outletTextItems: Schema.Attribute.Component<
      'products.outlet-text-item',
      true
    >;
  };
}

export interface ProductsGallerySet extends Struct.ComponentSchema {
  collectionName: 'components_products_gallery_sets';
  info: {
    description: 'Gallery media mapped by design + colour';
    displayName: 'Gallery set';
    icon: 'landscape';
  };
  attributes: {
    colourId: Schema.Attribute.String & Schema.Attribute.Required;
    designId: Schema.Attribute.String & Schema.Attribute.Required;
    images: Schema.Attribute.Media<'images', true> & Schema.Attribute.Required;
  };
}

export interface ProductsGlobalScale extends Struct.ComponentSchema {
  collectionName: 'components_products_global_scales';
  info: {
    description: 'Global scale section';
    displayName: 'Global scale';
    icon: 'world';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    cta: Schema.Attribute.Component<'shared.cta', false> &
      Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsHeroConfigurator extends Struct.ComponentSchema {
  collectionName: 'components_products_hero_configurators';
  info: {
    description: 'Pave configurator hero';
    displayName: 'Hero configurator';
    icon: 'feather';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    calculator: Schema.Attribute.Component<
      'products.calculator-config',
      false
    > &
      Schema.Attribute.Required;
    colourHeading: Schema.Attribute.String & Schema.Attribute.Required;
    colourHelper: Schema.Attribute.String;
    colours: Schema.Attribute.Component<'products.option-colour', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    defaults: Schema.Attribute.Component<
      'products.configurator-defaults',
      false
    > &
      Schema.Attribute.Required;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    designContextLabel: Schema.Attribute.String & Schema.Attribute.Required;
    designHeading: Schema.Attribute.String & Schema.Attribute.Required;
    designs: Schema.Attribute.Component<'products.option-design', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    gallerySets: Schema.Attribute.Component<'products.gallery-set', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    gridImages: Schema.Attribute.Media<'images', true>;
    learnMore: Schema.Attribute.Component<'shared.cta', false> &
      Schema.Attribute.Required;
    primaryCta: Schema.Attribute.Component<'shared.cta', false> &
      Schema.Attribute.Required;
    sizes: Schema.Attribute.Component<'products.option-size', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    sizesHeading: Schema.Attribute.String & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsHeroStandard extends Struct.ComponentSchema {
  collectionName: 'components_products_hero_standards';
  info: {
    description: 'Non-configurator product hero';
    displayName: 'Hero standard';
    icon: 'feather';
  };
  attributes: {
    badge: Schema.Attribute.String;
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    primaryCta: Schema.Attribute.Component<'shared.cta', false> &
      Schema.Attribute.Required;
    secondaryCta: Schema.Attribute.Component<'shared.cta', false>;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsImpactCard extends Struct.ComponentSchema {
  collectionName: 'components_products_impact_cards';
  info: {
    description: 'Impact grid item';
    displayName: 'Impact card';
    icon: 'chartPie';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsImpactGrid extends Struct.ComponentSchema {
  collectionName: 'components_products_impact_grids';
  info: {
    description: 'Product impact cards grid';
    displayName: 'Impact grid';
    icon: 'grid';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    cards: Schema.Attribute.Component<'products.impact-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsLocationTab extends Struct.ComponentSchema {
  collectionName: 'components_products_location_tabs';
  info: {
    description: 'Location selector item for Mod.factory hero';
    displayName: 'Location tab';
    icon: 'pinMap';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    shortLabel: Schema.Attribute.String;
    tabKey: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsMetricsBasic extends Struct.ComponentSchema {
  collectionName: 'components_products_metrics_basics';
  info: {
    description: 'Generic simple metrics section';
    displayName: 'Metrics basic';
    icon: 'chartBar';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    eyebrow: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Key metrics'>;
    heading: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Built for measurable impact.'>;
    items: Schema.Attribute.Component<'shared.metric-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 8;
          min: 1;
        },
        number
      >;
  };
}

export interface ProductsMetricsSuite extends Struct.ComponentSchema {
  collectionName: 'components_products_metrics_suites';
  info: {
    description: 'Pave art-directed technical + comparison wrapper';
    displayName: 'Metrics suite';
    icon: 'stack';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    comparison: Schema.Attribute.Component<
      'products.product-comparison',
      false
    > &
      Schema.Attribute.Required;
    techSpec: Schema.Attribute.Component<'products.product-tech-spec', false> &
      Schema.Attribute.Required;
  };
}

export interface ProductsModFactoryHero extends Struct.ComponentSchema {
  collectionName: 'components_products_mod_factory_heroes';
  info: {
    description: 'Bespoke Mod.factory hero section';
    displayName: 'Mod.factory hero';
    icon: 'feather';
  };
  attributes: {
    bgColorHex: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#050720'>;
    defaultTabKey: Schema.Attribute.String & Schema.Attribute.Required;
    desktopHeroImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    headline: Schema.Attribute.Text & Schema.Attribute.Required;
    locationTabs: Schema.Attribute.Component<'products.location-tab', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    metrics: Schema.Attribute.Component<'shared.metric-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 4;
          min: 1;
        },
        number
      >;
    mobileHeroImage: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    subheadline: Schema.Attribute.Text & Schema.Attribute.Required;
  };
}

export interface ProductsOptionColour extends Struct.ComponentSchema {
  collectionName: 'components_products_option_colours';
  info: {
    description: 'Configurator colour option';
    displayName: 'Option colour';
    icon: 'palette';
  };
  attributes: {
    colourId: Schema.Attribute.String & Schema.Attribute.Required;
    imageSlugPart: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    slug: Schema.Attribute.String;
    swatchImage: Schema.Attribute.Media<'images'>;
  };
}

export interface ProductsOptionDesign extends Struct.ComponentSchema {
  collectionName: 'components_products_option_designs';
  info: {
    description: 'Configurator design option';
    displayName: 'Option design';
    icon: 'paint';
  };
  attributes: {
    designId: Schema.Attribute.String & Schema.Attribute.Required;
    icon: Schema.Attribute.Media<'images'>;
    kind: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsOptionSize extends Struct.ComponentSchema {
  collectionName: 'components_products_option_sizes';
  info: {
    description: 'Configurator size option';
    displayName: 'Option size';
    icon: 'resize';
  };
  attributes: {
    dimensionsText: Schema.Attribute.String;
    helperText: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    sizeId: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsOutletLogo extends Struct.ComponentSchema {
  collectionName: 'components_products_outlet_logos';
  info: {
    description: 'Featured-in outlet logo row';
    displayName: 'Outlet logo';
    icon: 'picture';
  };
  attributes: {
    darkImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    lightImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    name: Schema.Attribute.String & Schema.Attribute.Required;
    website: Schema.Attribute.String;
  };
}

export interface ProductsOutletTextItem extends Struct.ComponentSchema {
  collectionName: 'components_products_outlet_text_items';
  info: {
    description: 'Featured-in text outlet row';
    displayName: 'Outlet text item';
    icon: 'quote';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsProductComparison extends Struct.ComponentSchema {
  collectionName: 'components_products_product_comparisons';
  info: {
    description: 'Bottom comparison block';
    displayName: 'ProductComparison';
    icon: 'collapse';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    leftColumnLabel: Schema.Attribute.String & Schema.Attribute.Required;
    rightColumnLabel: Schema.Attribute.String & Schema.Attribute.Required;
    rows: Schema.Attribute.Component<'products.comparison-row', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 12;
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsProductTechSpec extends Struct.ComponentSchema {
  collectionName: 'components_products_product_tech_specs';
  info: {
    description: 'Top technical block with dropdown variants';
    displayName: 'ProductTechSpec';
    icon: 'dashboard';
  };
  attributes: {
    defaultVariantKey: Schema.Attribute.String & Schema.Attribute.Required;
    downloadCta: Schema.Attribute.Component<'shared.cta', false>;
    dropdownLabel: Schema.Attribute.String & Schema.Attribute.Required;
    dropdownPlaceholder: Schema.Attribute.String;
    title: Schema.Attribute.String & Schema.Attribute.Required;
    variants: Schema.Attribute.Component<'products.tech-spec-variant', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
  };
}

export interface ProductsRichCopyBlock extends Struct.ComponentSchema {
  collectionName: 'components_products_rich_copy_blocks';
  info: {
    description: 'Bottom copy content block';
    displayName: 'Rich copy block';
    icon: 'pencil';
  };
  attributes: {
    copy: Schema.Attribute.RichText & Schema.Attribute.Required;
  };
}

export interface ProductsTechSpecItem extends Struct.ComponentSchema {
  collectionName: 'components_products_tech_spec_items';
  info: {
    description: 'Technical spec item for selected variant';
    displayName: 'Tech spec item';
    icon: 'bulletList';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsTechSpecVariant extends Struct.ComponentSchema {
  collectionName: 'components_products_tech_spec_variants';
  info: {
    description: 'Variant option for ProductTechSpec dropdown';
    displayName: 'Tech spec variant';
    icon: 'filter';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    productImageDesktop: Schema.Attribute.Media<'images'> &
      Schema.Attribute.Required;
    productImageMobile: Schema.Attribute.Media<'images'>;
    specItems: Schema.Attribute.Component<'products.tech-spec-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    variantKey: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsTechnicalShowcase extends Struct.ComponentSchema {
  collectionName: 'components_products_technical_showcases';
  info: {
    description: 'Pave technical showcase section';
    displayName: 'Technical showcase';
    icon: 'dashboard';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    heading: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    metrics: Schema.Attribute.Component<
      'products.technical-showcase-metric',
      true
    > &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    textureImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

export interface ProductsTechnicalShowcaseMetric
  extends Struct.ComponentSchema {
  collectionName: 'components_products_technical_showcase_metrics';
  info: {
    description: 'Value and description for technical showcase';
    displayName: 'Technical showcase metric';
    icon: 'dashboard';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsTechnicalSpecs extends Struct.ComponentSchema {
  collectionName: 'components_products_technical_specs';
  info: {
    description: 'Mod.factory technical specs section';
    displayName: 'Technical specs';
    icon: 'dashboard';
  };
  attributes: {
    backgroundImage: Schema.Attribute.Media<'images'>;
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    diagramImage: Schema.Attribute.Media<'images'>;
    diagramLottie: Schema.Attribute.Media<'files'>;
    diagramMode: Schema.Attribute.Enumeration<['lottie', 'image', 'none']> &
      Schema.Attribute.Required;
    downloadCta: Schema.Attribute.Component<'shared.cta', false>;
    intro: Schema.Attribute.Text;
    label: Schema.Attribute.String &
      Schema.Attribute.DefaultTo<'Technical brief'>;
    specs: Schema.Attribute.Component<'shared.spec-item', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsUseCaseCard extends Struct.ComponentSchema {
  collectionName: 'components_products_use_case_cards';
  info: {
    description: 'Product use case item';
    displayName: 'Use case card';
    icon: 'grid';
  };
  attributes: {
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    image: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsUseCases extends Struct.ComponentSchema {
  collectionName: 'components_products_use_cases';
  info: {
    description: 'Product use cases section';
    displayName: 'Use cases';
    icon: 'layout';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    cards: Schema.Attribute.Component<'products.use-case-card', true> &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMax<
        {
          max: 6;
          min: 1;
        },
        number
      >;
    intro: Schema.Attribute.Text & Schema.Attribute.Required;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface ProductsVoiceTestimonial extends Struct.ComponentSchema {
  collectionName: 'components_products_voice_testimonials';
  info: {
    description: 'Pave voice testimonial section';
    displayName: 'Voice testimonial';
    icon: 'microphone';
  };
  attributes: {
    bgType: Schema.Attribute.Enumeration<['light', 'dark']> &
      Schema.Attribute.Required;
    personName: Schema.Attribute.String & Schema.Attribute.Required;
    personRole: Schema.Attribute.String;
    portraitImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    quote: Schema.Attribute.RichText & Schema.Attribute.Required;
    supportImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
  };
}

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
    alt: Schema.Attribute.String;
    description: Schema.Attribute.Text & Schema.Attribute.Required;
    imageDesktop: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    imageMobile: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
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

export interface SharedCta extends Struct.ComponentSchema {
  collectionName: 'components_shared_ctas';
  info: {
    description: 'Reusable call-to-action link';
    displayName: 'CTA';
    icon: 'cursor';
  };
  attributes: {
    href: Schema.Attribute.String & Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    variant: Schema.Attribute.Enumeration<
      ['primary', 'secondary', 'tertiary', 'link']
    > &
      Schema.Attribute.DefaultTo<'primary'>;
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
    contactText: Schema.Attribute.Text;
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

export interface SharedJournalCardPattern extends Struct.ComponentSchema {
  collectionName: 'components_shared_journal_card_patterns';
  info: {
    description: 'Background pattern image pair for journal cards';
    displayName: 'Journal card pattern';
    icon: 'brush';
  };
  attributes: {
    desktopImage: Schema.Attribute.Media<'images'> & Schema.Attribute.Required;
    label: Schema.Attribute.String;
    mobileImage: Schema.Attribute.Media<'images'>;
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

export interface SharedMetricItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_metric_items';
  info: {
    description: 'Reusable metric value + label';
    displayName: 'Metric item';
    icon: 'chartBar';
  };
  attributes: {
    helper: Schema.Attribute.String;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
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

export interface SharedSpecItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_spec_items';
  info: {
    description: 'Reusable label/value specification row';
    displayName: 'Spec item';
    icon: 'bulletList';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    value: Schema.Attribute.String & Schema.Attribute.Required;
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
      'journal.breakout-text': JournalBreakoutText;
      'journal.full-width-image': JournalFullWidthImage;
      'journal.single-column': JournalSingleColumn;
      'journal.text-image-pair-left': JournalTextImagePairLeft;
      'journal.text-image-pair-right': JournalTextImagePairRight;
      'journal.two-column': JournalTwoColumn;
      'journal.two-images': JournalTwoImages;
      'journal.video-embed': JournalVideoEmbed;
      'products.calculator-config': ProductsCalculatorConfig;
      'products.closing-quote-impact-cta': ProductsClosingQuoteImpactCta;
      'products.closing-quote-simple': ProductsClosingQuoteSimple;
      'products.comparison-row': ProductsComparisonRow;
      'products.configurator-defaults': ProductsConfiguratorDefaults;
      'products.container-statement': ProductsContainerStatement;
      'products.deploy-step': ProductsDeployStep;
      'products.deploy-steps': ProductsDeploySteps;
      'products.factory-target': ProductsFactoryTarget;
      'products.featured-in': ProductsFeaturedIn;
      'products.gallery-set': ProductsGallerySet;
      'products.global-scale': ProductsGlobalScale;
      'products.hero-configurator': ProductsHeroConfigurator;
      'products.hero-standard': ProductsHeroStandard;
      'products.impact-card': ProductsImpactCard;
      'products.impact-grid': ProductsImpactGrid;
      'products.location-tab': ProductsLocationTab;
      'products.metrics-basic': ProductsMetricsBasic;
      'products.metrics-suite': ProductsMetricsSuite;
      'products.mod-factory-hero': ProductsModFactoryHero;
      'products.option-colour': ProductsOptionColour;
      'products.option-design': ProductsOptionDesign;
      'products.option-size': ProductsOptionSize;
      'products.outlet-logo': ProductsOutletLogo;
      'products.outlet-text-item': ProductsOutletTextItem;
      'products.product-comparison': ProductsProductComparison;
      'products.product-tech-spec': ProductsProductTechSpec;
      'products.rich-copy-block': ProductsRichCopyBlock;
      'products.tech-spec-item': ProductsTechSpecItem;
      'products.tech-spec-variant': ProductsTechSpecVariant;
      'products.technical-showcase': ProductsTechnicalShowcase;
      'products.technical-showcase-metric': ProductsTechnicalShowcaseMetric;
      'products.technical-specs': ProductsTechnicalSpecs;
      'products.use-case-card': ProductsUseCaseCard;
      'products.use-cases': ProductsUseCases;
      'products.voice-testimonial': ProductsVoiceTestimonial;
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
      'shared.cta': SharedCta;
      'shared.external-link': SharedExternalLink;
      'shared.faq-item': SharedFaqItem;
      'shared.image-pair': SharedImagePair;
      'shared.image-text': SharedImageText;
      'shared.journal-card-pattern': SharedJournalCardPattern;
      'shared.media-block': SharedMediaBlock;
      'shared.metric-item': SharedMetricItem;
      'shared.overview-item': SharedOverviewItem;
      'shared.responsive-image': SharedResponsiveImage;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.spec-item': SharedSpecItem;
      'shared.video-block': SharedVideoBlock;
    }
  }
}
