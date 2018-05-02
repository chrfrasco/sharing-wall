//@ts-check
import React from "react";

const sites = {
  facebook: "facebook",
  twitter: "twitter",
  instagram: "instagram",
  youtube: "youtube"
};

const I = ({ styleName }) => (
  <i className={`social-i ${styleName ? styleName : ""}`} aria-hidden="true" />
);

const icons = {
  [sites.facebook]: <I styleName="fa fa-facebook fa-2x" />,
  [sites.twitter]: <I styleName="fa fa-twitter fa-2x" />,
  [sites.instagram]: <I styleName="fa fa-instagram fa-2x" />,
  [sites.youtube]: <I styleName="fa fa-youtube-play fa-2x" />
};

const SocialLink = ({ link: { site, url } }) => (
  <a href={url} target="external">
    {icons[site]}
  </a>
);

/**
 * A grouping of social icons
 * @param {{ links: any[], styleName: string }} props
 */
const Social = /** @type {React.SFC<any>} */ (({ links, styleName }) => (
  <nav className={`social ${styleName || ""}`}>
    {links.map((link, i) => <SocialLink key={i} link={link} />)}
  </nav>
));

Social.defaultProps = {
  links: [
    {
      site: sites.facebook,
      url: "https://www.facebook.com/200-Women-267011413723820/"
    },
    { site: sites.twitter, url: "https://twitter.com/twohundredwomen" },
    { site: sites.instagram, url: "https://www.instagram.com/200women" },
    {
      site: sites.youtube,
      url: "https://www.youtube.com/channel/UCA-D5ZrBnRi-1CFLoy03Cdw"
    }
  ]
};

export default Social;
