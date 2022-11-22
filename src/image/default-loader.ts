import { ImageConfig } from './types'

export type ImageLoaderProps = {
  src: string
  width: number
  quality?: number
}

export type ImageLoaderPropsWithConfig = ImageLoaderProps & {
  config: Readonly<ImageConfig>
}

export function defaultLoader({
  config,
  src,
  width,
  quality,
}: ImageLoaderPropsWithConfig): string {
  if (process.env.NODE_ENV !== 'production') {
    const missingValues = []

    // these should always be provided but make sure they are
    if (!src) missingValues.push('src')
    if (!width) missingValues.push('width')

    if (missingValues.length > 0) {
      throw new Error(
        `Solito Image requires ${missingValues.join(
          ', '
        )} to be provided. Make sure you pass them as props to the \`solito/image\` component. Received: ${JSON.stringify(
          { src, width, quality }
        )}`
      )
    }

    if (src.startsWith('/') && !config.nextJsURL) {
      throw new Error(
        `[solito/image] Please add the "nextJsURL" prop to your <SolitoProvider /> to use relative paths.
        
Error due to image source "${src}".`
      )
    }
  }

  if (src.startsWith('http')) {
    return src
  }

  return `${config.nextJsURL}${config.path}?url=${encodeURIComponent(
    src
  )}&w=${width}&q=${quality || 75}`
}

// We use this to determine if the import is the default loader
// or a custom loader defined by the user in next.config.js
// defaultLoader.__next_img_default = true
