import React from 'react';
import { StatusLevel } from '../types';
import { 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon, 
  Info, 
  WifiOff, 
  ShieldCheck, 
  Activity 
} from 'lucide-react';

interface StatusBadgeProps {
  status: StatusLevel | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = '',
}) => {
  const normStatus = status.toLowerCase();

  let config = {
    bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
    icon: <Activity className="w-3.5 h-3.5" />,
    text: status,
    dotColor: 'bg-slate-500',
  };

  switch (normStatus) {
    case 'safe':
    case 'normal':
    case 'good':
      config = {
        bg: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800',
        icon: <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />,
        text: 'SAFE',
        dotColor: 'bg-emerald-500',
      };
      break;

    case 'warning':
    case 'moderate':
    case 'medium':
      config = {
        bg: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />,
        text: 'WARNING',
        dotColor: 'bg-amber-500',
      };
      break;

    case 'high':
      config = {
        bg: 'bg-orange-50 text-orange-700 dark:bg-orange-950/60 dark:text-orange-300 border-orange-300 dark:border-orange-800',
        icon: <AlertTriangle className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />,
        text: 'HIGH',
        dotColor: 'bg-orange-500',
      };
      break;

    case 'critical':
    case 'emergency':
    case 'urgent':
      config = {
        bg: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-300 dark:border-rose-800 animate-pulse-slow',
        icon: <AlertOctagon className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />,
        text: 'CRITICAL',
        dotColor: 'bg-rose-600',
      };
      break;

    case 'info':
    case 'information':
      config = {
        bg: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-300 dark:border-sky-800',
        icon: <Info className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />,
        text: 'INFORMATION',
        dotColor: 'bg-sky-500',
      };
      break;

    case 'offline':
    case 'maintenance':
      config = {
        bg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-300 dark:border-slate-700',
        icon: <WifiOff className="w-3.5 h-3.5 text-slate-500" />,
        text: 'OFFLINE',
        dotColor: 'bg-slate-500',
      };
      break;

    case 'resolved':
    case 'closed':
    case 'completed':
      config = {
        bg: 'bg-teal-50 text-teal-700 dark:bg-teal-950/60 dark:text-teal-300 border-teal-300 dark:border-teal-800',
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />,
        text: 'RESOLVED',
        dotColor: 'bg-teal-500',
      };
      break;
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs font-semibold px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-semibold px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border ${sizeClasses[size]} ${config.bg} ${className}`}
    >
      <span className={`w-2 h-2 rounded-full ${config.dotColor} flex-shrink-0`} />
      {showIcon && <span className="flex-shrink-0">{config.icon}</span>}
      <span className="tracking-wide uppercase font-medium">{config.text}</span>
    </span>
  );
};
