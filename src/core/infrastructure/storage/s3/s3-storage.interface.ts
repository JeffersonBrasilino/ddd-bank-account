import { AbstractError } from '../../../domain/errors';

export interface S3StorageConfig {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
  bucket: string;
  endpoint?: string;
  presignedUrlEndpoint?: string;
  forcePathStyle?: boolean;
}

export interface S3StorageInterface {
  /**
   * Salva um arquivo no S3
   * @param path - Caminho onde o arquivo será salvo (incluindo nome do arquivo)
   * @param fileContent - Conteúdo do arquivo (string, Buffer, etc.)
   * @param contentType - Tipo de conteúdo do arquivo (opcional)
   * @returns Promise<boolean | AbstractError<any>>
   */
  saveFile(
    path: string,
    fileContent: string | Buffer,
    contentType?: string,
  ): Promise<boolean | AbstractError<any>>;

  /**
   * Recupera um arquivo do S3
   * @param path - Caminho do arquivo no S3
   * @returns Promise<string | AbstractError<any>> - Conteúdo do arquivo como string
   */
  getFile(path: string): Promise<string | AbstractError<any>>;

  /**
   * Deleta um arquivo do S3
   * @param path - Caminho do arquivo no S3
   * @returns Promise<boolean | AbstractError<any>>
   */
  deleteFile(path: string): Promise<boolean | AbstractError<any>>;

  /**
   * Gera uma URL temporária para acesso ao arquivo
   * @param path - Caminho do arquivo no S3
   * @param expirationTimeInSeconds - Tempo de expiração em segundos
   * @returns Promise<string | AbstractError<any>> - URL temporária
   */
  getTemporaryUrl(
    path: string,
    expirationTimeInSeconds: number,
  ): Promise<string | AbstractError<any>>;

  getPresignedUploadUrl(
    path: string,
    options?: {
      contentType?: string;
      expiresInSeconds?: number;
    },
  ): Promise<string | AbstractError<any>>;
}
