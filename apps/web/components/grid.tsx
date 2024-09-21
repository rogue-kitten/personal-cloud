import { cn } from '@/utils/utils';
import { ReactNode } from 'react';

interface GridProps {
  headerText: string;
  headerIcon: ReactNode;
  headerSubtext?: string;
  cardContent?: ReactNode;
  emptyStateComponent?: ReactNode;
  size?: 'small' | 'large';
  optionIcon?: ReactNode;
}

function Grid({
  headerIcon,
  cardContent,
  headerText,
  headerSubtext,
  size = 'large',
  optionIcon,
}: GridProps) {
  return (
    <div
      className={cn(
        'm-4 h-[315px] overflow-hidden rounded-2xl bg-transparent p-0 transition-all duration-300 hover:scale-[1.03]',
        size === 'large' ? 'w-[315px] lg:w-[660px]' : 'w-[315px]',
      )}
    >
      <div className='-mt-2.5 w-full bg-[#f8f8fcd9] pb-px pt-2.5 backdrop-blur-15 backdrop-saturate-86'>
        <div className='m-2.5 px-4 py-2'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-2'>
              {headerIcon}
              <div>
                <p className='text-xl font-medium leading-6'>{headerText}</p>
                <p className='text-sm text-gray-500'>{headerSubtext}</p>
              </div>
            </div>
            {optionIcon}
          </div>
        </div>
      </div>
      <div className='flex h-[235px] w-full flex-shrink-0 flex-wrap bg-hover_grey'>
        {cardContent}
      </div>
    </div>
  );
}

export default Grid;
