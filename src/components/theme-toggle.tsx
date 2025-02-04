import { Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/contexts/theme-context';

const iconVariants = {
  initial: { scale: 0, rotate: -180, opacity: 0 },
  animate: { scale: 1, rotate: 0, opacity: 1 },
  exit: { scale: 0, rotate: 180, opacity: 0 },
};

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant='ghost'
      size='icon'
      onClick={toggleTheme}
      className='fixed top-4 right-4'
    >
      <AnimatePresence mode='wait' initial={false}>
        <motion.div
          key={theme}
          variants={iconVariants}
          initial='initial'
          animate='animate'
          exit='exit'
          transition={{
            duration: 0.3,
            ease: 'anticipate',
          }}
        >
          {theme === 'dark' ? (
            <Sun className='h-5 w-5' />
          ) : (
            <Moon className='h-5 w-5' />
          )}
        </motion.div>
      </AnimatePresence>
      <span className='sr-only'>Переключение темы</span>
    </Button>
  );
}
