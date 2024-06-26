import FocusTrap from 'focus-trap-react';
import {
  Badge,
  Box,
  config,
  Icon,
  IconButton,
  Icons,
  IconSrc,
  Line,
  Menu,
  PopOut,
  RectCords,
  Scroll,
  Text,
  Tooltip,
  TooltipProvider,
  toRem,
} from 'folds';
import { useTranslation } from 'react-i18next';
import React, { MouseEventHandler, ReactNode, useState } from 'react';
import { ReactEditor, useSlate } from 'slate-react';
import {
  headingLevel,
  isAnyMarkActive,
  isBlockActive,
  isMarkActive,
  removeAllMark,
  toggleBlock,
  toggleMark,
} from './utils';
import * as css from './Editor.css';
import { BlockType, MarkType } from './types';
import { HeadingLevel } from './slate';
import { isMacOS } from '../../utils/user-agent';
import { KeySymbol } from '../../utils/key-symbol';
import { useSetting } from '../../state/hooks/settings';
import { settingsAtom } from '../../state/settings';

function BtnTooltip({ text, shortCode }: { text: string; shortCode?: string }) {
  return (
    <Tooltip style={{ padding: config.space.S300 }}>
      <Box gap="200" direction="Column" alignItems="Center">
        <Text align="Center">{text}</Text>
        {shortCode && (
          <Badge as="kbd" radii="300" size="500">
            <Text size="T200" align="Center">
              {shortCode}
            </Text>
          </Badge>
        )}
      </Box>
    </Tooltip>
  );
}

type MarkButtonProps = { format: MarkType; icon: IconSrc; tooltip: ReactNode };
export function MarkButton({ format, icon, tooltip }: MarkButtonProps) {
  const editor = useSlate();
  const disableInline = isBlockActive(editor, BlockType.CodeBlock);

  if (disableInline) {
    removeAllMark(editor);
  }

  const handleClick = () => {
    toggleMark(editor, format);
    ReactEditor.focus(editor);
  };

  return (
    <TooltipProvider tooltip={tooltip} delay={500}>
      {(triggerRef) => (
        <IconButton
          ref={triggerRef}
          variant="SurfaceVariant"
          onClick={handleClick}
          aria-pressed={isMarkActive(editor, format)}
          size="400"
          radii="300"
          disabled={disableInline}
        >
          <Icon size="200" src={icon} />
        </IconButton>
      )}
    </TooltipProvider>
  );
}

type BlockButtonProps = {
  format: BlockType;
  icon: IconSrc;
  tooltip: ReactNode;
};
export function BlockButton({ format, icon, tooltip }: BlockButtonProps) {
  const editor = useSlate();

  const handleClick = () => {
    toggleBlock(editor, format, { level: 1 });
    ReactEditor.focus(editor);
  };

  return (
    <TooltipProvider tooltip={tooltip} delay={500}>
      {(triggerRef) => (
        <IconButton
          ref={triggerRef}
          variant="SurfaceVariant"
          onClick={handleClick}
          aria-pressed={isBlockActive(editor, format)}
          size="400"
          radii="300"
        >
          <Icon size="200" src={icon} />
        </IconButton>
      )}
    </TooltipProvider>
  );
}

export function HeadingBlockButton() {
  const editor = useSlate();
  const level = headingLevel(editor);
  const [anchor, setAnchor] = useState<RectCords>();
  const isActive = isBlockActive(editor, BlockType.Heading);
  const modKey = isMacOS() ? KeySymbol.Command : 'Strg';

  const handleMenuSelect = (selectedLevel: HeadingLevel) => {
    setAnchor(undefined);
    toggleBlock(editor, BlockType.Heading, { level: selectedLevel });
    ReactEditor.focus(editor);
  };
  const { t } = useTranslation();

  const handleMenuOpen: MouseEventHandler<HTMLButtonElement> = (evt) => {
    if (isActive) {
      toggleBlock(editor, BlockType.Heading);
      return;
    }
    setAnchor(evt.currentTarget.getBoundingClientRect());
  };
  return (
    <PopOut
      anchor={anchor}
      offset={5}
      position="Top"
      content={
        <FocusTrap
          focusTrapOptions={{
            initialFocus: false,
            onDeactivate: () => setAnchor(undefined),
            clickOutsideDeactivates: true,
            isKeyForward: (evt: KeyboardEvent) =>
              evt.key === 'ArrowDown' || evt.key === 'ArrowRight',
            isKeyBackward: (evt: KeyboardEvent) => evt.key === 'ArrowUp' || evt.key === 'ArrowLeft',
          }}
        >
          <Menu style={{ padding: config.space.S100 }}>
            <Box gap="100">
              <TooltipProvider
                tooltip={<BtnTooltip text={`${t('Components.Toolbar.heading')} 1`} shortCode={`${modKey} + 1`} />}
                delay={500}
              >
                {(triggerRef) => (
                  <IconButton
                    ref={triggerRef}
                    onClick={() => handleMenuSelect(1)}
                    size="400"
                    radii="300"
                  >
                    <Icon size="200" src={Icons.Heading1} />
                  </IconButton>
                )}
              </TooltipProvider>
              <TooltipProvider
                tooltip={<BtnTooltip text={`${t('Components.Toolbar.heading')} 2`} shortCode={`${modKey} + 2`} />}
                delay={500}
              >
                {(triggerRef) => (
                  <IconButton
                    ref={triggerRef}
                    onClick={() => handleMenuSelect(2)}
                    size="400"
                    radii="300"
                  >
                    <Icon size="200" src={Icons.Heading2} />
                  </IconButton>
                )}
              </TooltipProvider>
              <TooltipProvider
                tooltip={<BtnTooltip text={`${t('Components.Toolbar.heading')} 3`} shortCode={`${modKey} + 3`} />}
                delay={500}
              >
                {(triggerRef) => (
                  <IconButton
                    ref={triggerRef}
                    onClick={() => handleMenuSelect(3)}
                    size="400"
                    radii="300"
                  >
                    <Icon size="200" src={Icons.Heading3} />
                  </IconButton>
                )}
              </TooltipProvider>
            </Box>
          </Menu>
        </FocusTrap>
      }
    >
      <IconButton
        style={{ width: 'unset' }}
        variant="SurfaceVariant"
        onClick={handleMenuOpen}
        aria-pressed={isActive}
        size="400"
        radii="300"
      >
        <Icon size="200" src={level ? Icons[`Heading${level}`] : Icons.Heading1} />
        <Icon size="200" src={isActive ? Icons.Cross : Icons.ChevronBottom} />
      </IconButton>
    </PopOut>
  );
}

type ExitFormattingProps = { tooltip: ReactNode };
export function ExitFormatting({ tooltip }: ExitFormattingProps) {
  const editor = useSlate();

  const handleClick = () => {
    if (isAnyMarkActive(editor)) {
      removeAllMark(editor);
    } else if (!isBlockActive(editor, BlockType.Paragraph)) {
      toggleBlock(editor, BlockType.Paragraph);
    }
    ReactEditor.focus(editor);
  };

  return (
    <TooltipProvider tooltip={tooltip} delay={500}>
      {(triggerRef) => (
        <IconButton
          ref={triggerRef}
          variant="SurfaceVariant"
          onClick={handleClick}
          size="400"
          radii="300"
        >
          <Text size="B400">{`Exit ${KeySymbol.Hyper}`}</Text>
        </IconButton>
      )}
    </TooltipProvider>
  );
}

export function Toolbar() {
  const editor = useSlate();
  const modKey = isMacOS() ? KeySymbol.Command : 'Strg';
  const disableInline = isBlockActive(editor, BlockType.CodeBlock);

  const canEscape = isAnyMarkActive(editor) || !isBlockActive(editor, BlockType.Paragraph);
  const [isMarkdown, setIsMarkdown] = useSetting(settingsAtom, 'isMarkdown');
  const { t } = useTranslation();

  return (
    <Box className={css.EditorToolbarBase}>
      <Scroll direction="Horizontal" size="0">
        <Box className={css.EditorToolbar} alignItems="Center" gap="300">
          <>
            <Box shrink="No" gap="100">
              <MarkButton
                format={MarkType.Bold}
                icon={Icons.Bold}
                tooltip={<BtnTooltip text={t('Components.Toolbar.bold')} shortCode={`${modKey} + B`} />}
              />
              <MarkButton
                format={MarkType.Italic}
                icon={Icons.Italic}
                tooltip={<BtnTooltip text={t('Components.Toolbar.italic')} shortCode={`${modKey} + I`} />}
              />
              <MarkButton
                format={MarkType.Underline}
                icon={Icons.Underline}
                tooltip={<BtnTooltip text={t('Components.Toolbar.underline')} shortCode={`${modKey} + U`} />}
              />
              <MarkButton
                format={MarkType.StrikeThrough}
                icon={Icons.Strike}
                tooltip={<BtnTooltip text={t('Components.Toolbar.strike_through')} shortCode={`${modKey} + S`} />}
              />
              <MarkButton
                format={MarkType.Code}
                icon={Icons.Code}
                tooltip={<BtnTooltip text={t('Components.Toolbar.inline_code')} shortCode={`${modKey} + [`} />}
              />
              <MarkButton
                format={MarkType.Spoiler}
                icon={Icons.EyeBlind}
                tooltip={<BtnTooltip text={t('Components.Toolbar.spoiler')} shortCode={`${modKey} + H`} />}
              />
            </Box>
            <Line variant="SurfaceVariant" direction="Vertical" style={{ height: toRem(12) }} />
          </>
          <Box shrink="No" gap="100">
            <BlockButton
              format={BlockType.BlockQuote}
              icon={Icons.BlockQuote}
              tooltip={<BtnTooltip text={t('Components.Toolbar.block_quote')} shortCode={`${modKey} + '`} />}
            />
            <BlockButton
              format={BlockType.CodeBlock}
              icon={Icons.BlockCode}
              tooltip={<BtnTooltip text={t('Components.Toolbar.block_code')} shortCode={`${modKey} + ;`} />}
            />
            <BlockButton
              format={BlockType.OrderedList}
              icon={Icons.OrderList}
              tooltip={<BtnTooltip text={t('Components.Toolbar.ordered_list')} shortCode={`${modKey} + 7`} />}
            />
            <BlockButton
              format={BlockType.UnorderedList}
              icon={Icons.UnorderList}
              tooltip={<BtnTooltip text={t('Components.Toolbar.unordered_list')} shortCode={`${modKey} + 8`} />}
            />
            <HeadingBlockButton />
          </Box>
          {canEscape && (
            <>
              <Line variant="SurfaceVariant" direction="Vertical" style={{ height: toRem(12) }} />
              <Box shrink="No" gap="100">
                <ExitFormatting
                  tooltip={
                    <BtnTooltip text={t('Components.Toolbar.exit_formatting')} shortCode={`Escape, ${modKey} + E`} />
                  }
                />
              </Box>
            </>
          )}
          <Box className={css.MarkdownBtnBox} shrink="No" grow="Yes" justifyContent="End">
            <TooltipProvider
              align="End"
              tooltip={<BtnTooltip text={t('Components.Toolbar.toggle_markdown')} />}
              delay={500}
            >
              {(triggerRef) => (
                <IconButton
                  ref={triggerRef}
                  variant="SurfaceVariant"
                  onClick={() => setIsMarkdown(!isMarkdown)}
                  aria-pressed={isMarkdown}
                  size="300"
                  radii="300"
                  disabled={disableInline || !!isAnyMarkActive(editor)}
                >
                  <Icon size="200" src={Icons.Markdown} filled={isMarkdown} />
                </IconButton>
              )}
            </TooltipProvider>
            <span />
          </Box>
        </Box>
      </Scroll>
    </Box>
  );
}
