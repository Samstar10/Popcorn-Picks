const NextImage = (props: any) => {
  const { src, alt, ...rest } = props
  return <img src={typeof src === 'string' ? src : src?.src} alt={alt || ''} {...rest} />
}
export default NextImage
