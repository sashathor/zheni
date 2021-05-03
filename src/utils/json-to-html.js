/** @jsx jsx */

import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Box, Divider, Heading, Text, Link, jsx } from 'theme-ui';
import shortid from 'shortid';

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Text as="h4">{text}</Text>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => (
      <Box mb={4}><Text variant="styles.p">{children}</Text></Box>
    ),
    [BLOCKS.HEADING_1]: (node, children) => (
      <Box mb={4}><Heading variant="styles.h1">{children}</Heading></Box>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <Box mb={4}><Heading variant="styles.h2">{children}</Heading></Box>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <Box mb={4}><Heading variant="styles.h3">{children}</Heading></Box>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <Box mb={4}><Heading variant="styles.h4">{children}</Heading></Box>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
      <Box mb={4}><Heading variant="styles.h5">{children}</Heading></Box>
    ),
    [BLOCKS.HR]: () => <Divider />,
    [INLINES.HYPERLINK]: (node, children) => (
      <Link href={node.data.uri}>{children}</Link>
    ),
  },
  renderText: (text, a, b) =>
    text
      .split('\\n')
      .flatMap((text, i) => [i > 0 && <br key={shortid.generate()} />, text]),
};

const jsonToHTML = (document) => documentToReactComponents(typeof document === 'string' ? JSON.parse(document) : document, options);

export default jsonToHTML;
