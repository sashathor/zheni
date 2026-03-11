import { graphql, useStaticQuery } from 'gatsby';
import { Theme } from 'types';

const useSmallLogo = (theme: Theme) => {
  const data = useStaticQuery(graphql`
    query {
      logoWhiteSmall: contentfulAsset(title: { eq: "logo-white-small" }) {
        description
        gatsbyImageData(width: 100, placeholder: BLURRED, formats: [AUTO, WEBP])
      }
      logoBlackSmall: contentfulAsset(title: { eq: "logo-black-small" }) {
        description
        gatsbyImageData(width: 100, placeholder: BLURRED, formats: [AUTO, WEBP])
      }
    }
  `);

  return data[theme === 'white' ? 'logoWhiteSmall' : 'logoBlackSmall'];
};

export default useSmallLogo;
