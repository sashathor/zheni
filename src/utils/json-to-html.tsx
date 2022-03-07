/** @jsx jsx */

import { ReactNode } from 'react';
import axios from 'axios';
import Image from 'gatsby-image';
import {
  BLOCKS,
  MARKS,
  INLINES,
  Node,
  Document,
} from '@contentful/rich-text-types';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { Box, Divider, Heading, Text, Link, jsx } from 'theme-ui';
import shortid from 'shortid';

const jsonToHTML = (document: Document, assets: any) => {
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
      [BLOCKS.EMBEDDED_ASSET]: (node: Node, children: ReactNode) => {
        const imgId = node.data.target.sys.id;
        let img;
        if (assets) {
          img = assets.find((asset: any) => asset.contentful_id === imgId);
        }

        if (!img) {
          return null;
        }

        return (
          <Image
            fluid={{ ...img.fluid }}
            sx={img.description ? JSON.parse(img.description) : undefined}
            alt={img.title}
            fadeIn
          />
        );
      },
    },
    renderText: (text: any) =>
      text
        .split('\\n')
        .flatMap((text: string, i: number) => [
          i > 0 && <br key={shortid.generate()} />,
          text,
        ]),
  };

  return documentToReactComponents(
    typeof document === 'string' ? JSON.parse(document) : document,
    options,
  );
};

export default jsonToHTML;
