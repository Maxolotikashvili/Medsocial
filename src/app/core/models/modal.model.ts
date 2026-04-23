export interface ModalConfig<T = any> {
  modalData?: T;
}

export interface PreviewImageData {
  src: string,
  alt?: string,
  customClass?: string,
  customStyle?: string
}

export type previewImageConfig = Omit<PreviewImageData, 'src'>;