import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import fridgeClosed from '../../assets/fridge-closed.png';
import fridgeOpen from '../../assets/fridge-open.png';

interface FridgeButtonProps {
  onClick: () => void;
}

export default function FridgeButton({ onClick }: FridgeButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex flex-col items-center group cursor-pointer"
      id="fridge-button"
    >
      <div className="relative w-28 h-36 rounded-2xl overflow-hidden flex items-center justify-center transition-all group-hover:shadow-xl group-hover:shadow-orange-900/10">
        <AnimatePresence mode="wait">
          {isHovered ? (
            <motion.img
              key="open"
              src={fridgeOpen}
              alt="Открытый холодильник"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-contain"
            />
          ) : (
            <motion.img
              key="closed"
              src={fridgeClosed}
              alt="Холодильник"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full h-full object-contain"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Label: arrow + "ИИ Помощник" when not hovered, "Твой холодильник" when hovered */}
      <AnimatePresence mode="wait">
        {isHovered ? (
          <motion.div
            key="hovered-label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="mt-1 text-[10px] font-bold text-[#D85A30] uppercase tracking-tighter"
          >
            Твой холодильник
          </motion.div>
        ) : (
          <motion.div
            key="default-label"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="mt-1 flex items-center gap-1"
          >
            <span className="text-[9px] text-[#78716c] font-medium">ИИ Помощник</span>
            <span className="text-[9px] text-[#78716c]">&#8593;</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
