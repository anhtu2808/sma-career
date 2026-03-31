/**
 * Font Awesome icon registry for sma-career
 * Trimmed version of sma-employer/src/utils/icons.js
 * Maps Material Icon names → FA icon definitions for dynamic icon resolution
 */
import type { IconDefinition } from "@fortawesome/fontawesome-svg-core";

import {
  faArrowTrendUp,
  faBolt,
  faBriefcase,
  faBuilding,
  faCircleCheck,
  faCircleQuestion,
  faCity,
  faClock,
  faCode,
  faCreditCard,
  faGear,
  faGift,
  faGlobe,
  faGraduationCap,
  faHandPointer,
  faLightbulb,
  faLocationDot,
  faPeopleGroup,
  faRocket,
  faShieldHalved,
  faStar,
  faUsers,
  faHeart,
  faLaptopCode,
  faChartLine,
  faMedal,
} from "@fortawesome/free-solid-svg-icons";

export const materialToFA: Record<string, IconDefinition> = {
  // Common EVP icons
  payments: faCreditCard,
  apartment: faCity,
  trending_up: faArrowTrendUp,
  security: faShieldHalved,
  school: faGraduationCap,
  bolt: faBolt,
  code: faCode,
  public: faGlobe,
  lightbulb: faLightbulb,
  rocket_launch: faRocket,
  location_on: faLocationDot,
  work: faBriefcase,
  business: faBuilding,
  groups: faPeopleGroup,
  people: faUsers,
  settings: faGear,
  grade: faStar,
  star: faStar,
  redeem: faGift,
  check_circle: faCircleCheck,
  touch_app: faHandPointer,
  schedule: faClock,
  heart: faHeart,
  laptop: faLaptopCode,
  chart: faChartLine,
  medal: faMedal,
  workspace_premium: faMedal,

  // Simple aliases
  "dollar-sign": faCreditCard,
  home: faCity,
  "trending-up": faArrowTrendUp,
};

/**
 * Resolve a Material Icon name to a Font Awesome icon definition.
 * Falls back to faCircleQuestion for unknown icons.
 */
export function resolveIcon(name?: string): IconDefinition {
  if (!name) return faCircleQuestion;
  return materialToFA[name] || faCircleQuestion;
}
