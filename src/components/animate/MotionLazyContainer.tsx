import { ReactNode } from 'react'
import { LazyMotion } from 'framer-motion'

// ----------------------------------------------------------------------

// eslint-disable-next-line import/extensions
// @ts-ignore
const loadFeatures = () => import('./features.js').then((res) => res.default)

type Props = {
  children: ReactNode;
};

export default function MotionLazyContainer ({ children }: Props) {
  return (
    <LazyMotion strict features={loadFeatures}>
      {children}
    </LazyMotion>
  )
}
