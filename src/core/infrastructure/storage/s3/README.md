# S3 Storage - Implementação Genérica

Esta implementação fornece uma interface genérica para operações de storage S3 que pode ser usada com diferentes provedores (AWS S3, LocalStack, etc.).

## Estrutura

```
src/core/infrastructure/storage/s3/
├── s3-storage.interface.ts          # Interface genérica
├── aws-s3-storage.service.ts        # Implementação AWS S3
├── s3-storage.module.ts             # Módulo NestJS
├── s3-storage-example.service.ts    # Exemplo de uso
└── index.ts                         # Exportações
```

## Funcionalidades

### 1. Salvar Arquivo

```typescript
saveFile(path: string, fileContent: string | Buffer, contentType?: string)
```

### 2. Recuperar Arquivo

```typescript
getFile(path: string)
```

### 3. Deletar Arquivo

```typescript
deleteFile(path: string)
```

### 4. Gerar URL Temporária

```typescript
getTemporaryUrl(path: string, expirationTimeInSeconds: number)
```

### 5. Gerar URL assinada para upload (PUT)

```typescript
getPresignedUploadUrl(path: string, options?: { contentType?: string; expiresInSeconds?: number })
```

## Configuração

### Variáveis de Ambiente

```env
AWS_S3_KEY=your_access_key
AWS_S3_TOKEN=your_secret_key
AWS_S3_REGION=us-east-1
AWS_S3_BUCKET=your_bucket_name
AWS_S3_ENDPOINT=optional_endpoint_url
AWS_S3_FORCE_PATH_STYLE=true
```

### Uso no Módulo

```typescript
import { S3StorageModule } from '@core/infrastructure/storage/s3';

@Module({
  imports: [S3StorageModule],
  // ...
})
export class YourModule {}
```

### Injeção de Dependência

```typescript
import { Injectable, Inject } from '@nestjs/common';
import { S3StorageInterface } from '@core/infrastructure/storage/s3';

@Injectable()
export class YourService {
  constructor(
    @Inject('S3StorageInterface')
    private s3Storage: S3StorageInterface,
  ) {}

  async saveExample() {
    const result = await this.s3Storage.saveFile(
      'path/to/file.txt',
      'conteúdo do arquivo',
      'text/plain',
    );

    if (typeof result === 'boolean') {
      return result; // true se sucesso
    }

    // result é um AbstractError
    throw new Error(`Erro: ${result.getError()}`);
  }
}
```

## Exemplo Completo

```typescript
// 1. Salvar arquivo
await s3Storage.saveFile('users/123/profile.json', JSON.stringify(userData));

// 2. Recuperar arquivo
const content = await s3Storage.getFile('users/123/profile.json');

// 3. Gerar URL temporária (1 hora)
const url = await s3Storage.getTemporaryUrl('users/123/profile.json', 3600);

// 4. Deletar arquivo
await s3Storage.deleteFile('users/123/profile.json');
```

## Vantagens da Implementação Genérica

1. **Desacoplamento**: A interface não depende de implementação específica
2. **Testabilidade**: Fácil de mockar para testes
3. **Flexibilidade**: Pode ser implementada para diferentes provedores
4. **Reutilização**: Pode ser usada em diferentes módulos
5. **Manutenibilidade**: Mudanças na implementação não afetam os consumidores

## Princípios SOLID Aplicados

- **Single Responsibility**: Cada classe tem uma responsabilidade específica
- **Open/Closed**: A interface é aberta para extensão, fechada para modificação
- **Dependency Inversion**: Depende de abstrações, não de implementações concretas
- **Interface Segregation**: Interface focada apenas nas operações necessárias
