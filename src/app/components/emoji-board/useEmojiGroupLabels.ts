import { useMemo } from 'react';
import { EmojiGroupId } from '../../plugins/emoji';

export type IEmojiGroupLabels = Record<EmojiGroupId, string>;

export const useEmojiGroupLabels = (): IEmojiGroupLabels =>
  useMemo(
    () => ({
      [EmojiGroupId.People]: 'Components.Emoji.people',
      [EmojiGroupId.Nature]: 'Components.Emoji.nature',
      [EmojiGroupId.Food]: 'Components.Emoji.food',
      [EmojiGroupId.Activity]: 'Components.Emoji.activity',
      [EmojiGroupId.Travel]: 'Components.Emoji.travel',
      [EmojiGroupId.Object]: 'Components.Emoji.objects',
      [EmojiGroupId.Symbol]: 'Components.Emoji.symbols',
      [EmojiGroupId.Flag]: 'Components.Emoji.flags',
    }),
    []
  );
