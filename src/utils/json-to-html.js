/** @jsx jsx */
import { BLOCKS, MARKS, INLINES } from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Divider, Heading, Text, Link, jsx } from 'theme-ui';

const options = {
  renderMark: {
    [MARKS.BOLD]: (text) => <Text as="h4">aaa{text}</Text>,
  },
  renderNode: {
    [BLOCKS.PARAGRAPH]: (node, children) => <Text mb={3}>{children}</Text>,
    [BLOCKS.HEADING_1]: (node, children) => (
      <Heading variant="styles.h1">{children}</Heading>
    ),
    [BLOCKS.HEADING_2]: (node, children) => (
      <Heading variant="styles.h2">{children}</Heading>
    ),
    [BLOCKS.HEADING_3]: (node, children) => (
      <Heading variant="styles.h3">{children}</Heading>
    ),
    [BLOCKS.HEADING_4]: (node, children) => (
      <Heading variant="styles.h4">{children}</Heading>
    ),
    [BLOCKS.HEADING_5]: (node, children) => (
      <Heading variant="styles.h5">{children}</Heading>
    ),
    [BLOCKS.HR]: () => <Divider />,
    [INLINES.HYPERLINK]: (node, children) => (
      <Link href={node.data.uri}>{children}</Link>
    ),
  },
  renderText: (text) => text.replace('!', '?'),
};

const jsonToHTML = (document) => documentToReactComponents(document, options);

export default jsonToHTML;
