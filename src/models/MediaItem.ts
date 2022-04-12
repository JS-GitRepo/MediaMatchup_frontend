export default interface MediaItem {
  title: string | undefined;
  subtitle: string;
  artImg: string | undefined;
  artImg2?: string;
  category: string;
  winner?: boolean;
  nativeId?: string;
}
