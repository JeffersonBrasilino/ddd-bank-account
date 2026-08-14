import { Inject, Injectable } from '@nestjs/common';
import { S3StorageInterface } from './s3-storage.interface';

@Injectable()
export class S3StorageExampleService {
  constructor(
    @Inject('S3StorageInterface')
    private s3Storage: S3StorageInterface,
  ) {}

  /**
   * Exemplo de como salvar um arquivo no S3
   * @param path - Caminho onde o arquivo será salvo
   * @param content - Conteúdo do arquivo
   * @param contentType - Tipo de conteúdo (opcional)
   */
  async saveFileExample(
    path: string,
    content: string,
    contentType?: string,
  ): Promise<boolean> {
    const result = await this.s3Storage.saveFile(path, content, contentType);

    if (typeof result === 'boolean') {
      return result;
    }

    throw new Error(`Erro ao salvar arquivo: ${result.getError()}`);
  }

  /**
   * Exemplo de como recuperar um arquivo do S3
   * @param path - Caminho do arquivo no S3
   */
  async getFileExample(path: string): Promise<string> {
    const result = await this.s3Storage.getFile(path);

    if (typeof result === 'string') {
      return result;
    }

    throw new Error(`Erro ao recuperar arquivo: ${result.getError()}`);
  }

  /**
   * Exemplo de como deletar um arquivo do S3
   * @param path - Caminho do arquivo no S3
   */
  async deleteFileExample(path: string): Promise<boolean> {
    const result = await this.s3Storage.deleteFile(path);

    if (typeof result === 'boolean') {
      return result;
    }

    throw new Error(`Erro ao deletar arquivo: ${result.getError()}`);
  }

  /**
   * Exemplo de como gerar uma URL temporária para um arquivo
   * @param path - Caminho do arquivo no S3
   * @param expirationTimeInSeconds - Tempo de expiração em segundos
   */
  async getTemporaryUrlExample(
    path: string,
    expirationTimeInSeconds: number,
  ): Promise<string> {
    const result = await this.s3Storage.getTemporaryUrl(
      path,
      expirationTimeInSeconds,
    );

    if (typeof result === 'string') {
      return result;
    }

    throw new Error(`Error generating temporary URL: ${result.getError()}`);
  }

  /**
   * Exemplo de uso completo: salvar, recuperar e gerar URL temporária
   */
  async completeExample(): Promise<void> {
    const path = 'exemplo/arquivo.txt';
    const content = 'Conteúdo do arquivo de exemplo';

    try {
      // 1. Salvar arquivo

      await this.saveFileExample(path, content, 'text/plain');

      // 2. Recuperar arquivo
      const _retrievedContent = await this.getFileExample(path);

      // 3. Gerar URL temporária
      const _temporaryUrl = await this.getTemporaryUrlExample(path, 3600); // 1 hora

      // 4. Deletar arquivo
      await this.deleteFileExample(path);
    } catch (error) {
      console.error(
        'Erro no exemplo:',
        error instanceof Error ? error.message : String(error),
      );
    }
  }
}
