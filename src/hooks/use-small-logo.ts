import { graphql, useStaticQuery } from 'gatsby';
import { Theme } from 'types';

const useSmallLogo = (theme: Theme) => {
  const data = useStaticQuery(graphql`
    query {
      logoWhiteSmall: contentfulAsset(title: { eq: "logo-white-small" }) {
        description
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
      }
      logoBlackSmall: contentfulAsset(title: { eq: "logo-black-small" }) {
        description
        fluid {
          ...GatsbyContentfulFluid_withWebp
        }
      }
    }
  `);

  return data[theme === 'white' ? 'logoWhiteSmall' : 'logoBlackSmall'];
};

export default useSmallLogo;
