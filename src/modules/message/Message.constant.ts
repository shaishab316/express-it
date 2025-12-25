import type { Message as TMessage } from '@db';

export const messageSearchableFields = ['text'] satisfies (keyof TMessage)[];
