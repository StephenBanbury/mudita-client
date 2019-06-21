export interface IUnsplashImage {
  id: string,
  alt_description: string,
  urls: {
      raw: string,
      full: string,
      regular: string,
      small: string,
      thumb: string
  },
  links: {
      self: string,
      html: string,
      download: string,
      download_location: string
  },
  categories: [string],
  sponsored: boolean,
  sponsored_by: string,
  sponsored_impressions_id: number,
  likes: number,
  liked_by_user: boolean,
  current_user_collections: [string],
  user: {
      id: string,
      updated_at: string,
      username: string,
      name: string,
      first_name: string,
      last_name: string,
      twitter_username: string,
      portfolio_url: string,
      bio: string,
      location: string,
      links: {
          self: string,
          html: string,
          photos: string,
          likes: string,
          portfolio: string,
          following: string,
          followers: string
      },
      profile_image: {
          small: string,
          medium: string,
          large: string
      },
      instagram_username: string,
      total_collections: number,
      total_likes: number,
      total_photos: number,
      accepted_tos: boolean
  },
  exif: {
      make: string,
      model: string,
      exposure_time: string,
      aperture: string,
      focal_length: string,
      iso: number
  },
  views: number,
  downloads: number
}
