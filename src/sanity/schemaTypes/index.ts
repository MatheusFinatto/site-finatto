import { type SchemaTypeDefinition } from 'sanity'
import { imovelType } from './imovel'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [imovelType],
}
