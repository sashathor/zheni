/** @jsx jsx */

import { ReactNode } from 'react';
import {
  BLOCKS,
  MARKS,
  INLINES,
  Node,
  Document,
} from '@contentful/rich-text-types';
import {
  documentToReactComponents,
  NodeRenderer,
} from '@contentful/rich-text-react-renderer';
import { Box, Divider, Heading, Text, Link, jsx } from 'theme-ui';
import shortid from 'shortid';

const options = {
  renderMark: {
    [MARKS.BOLD]: (text: ReactNode) => <Text as="h4">{text}</Text>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node: Node, children: ReactNode) => (
      <Box mb={4}>
        <Text variant="styles.p">{children}</Text>
      </Box>
    ),
    [BLOCKS.HEADING_1]: (node: Node, children: ReactNode) => (
      <Box mb={4}>
        <Heading variant="styles.h1">{children}</Heading>
      </Box>
    ),
    [BLOCKS.HEADING_2]: (node: Node, children: ReactNode) => (
      <Box mb={4}>
        <Heading variant="styles.h2">{children}</Heading>
      </Box>
    ),
    [BLOCKS.HEADING_3]: (node: Node, children: ReactNode) => (
      <Box mb={4}>
        <Heading variant="styles.h3">{children}</Heading>
      </Box>
    ),
    [BLOCKS.HEADING_4]: (node: Node, children: ReactNode) => (
      <Box mb={4}>
        <Heading variant="styles.h4">{children}</Heading>
      </Box>
    ),
    [BLOCKS.HEADING_5]: (node: Node, children: ReactNode) => (
      <Box mb={4}>
        <Heading variant="styles.h5">{children}</Heading>
      </Box>
    ),
    [BLOCKS.HR]: () => <Divider />,
    [INLINES.HYPERLINK]: (node: Node, children: ReactNode) => (
      <Link href={node.data.uri}>{children}</Link>
    ),
  },
  renderText: (text: any) =>
    text
      .split('\\n')
      .flatMap((text: string, i: number) => [
        i > 0 && <br key={shortid.generate()} />,
        text,
      ]),
};

const jsonToHTML = (document: Document) =>
  documentToReactComponents(
    typeof document === 'string' ? JSON.parse(document) : document,
    options,
  );

export default jsonToHTML;
