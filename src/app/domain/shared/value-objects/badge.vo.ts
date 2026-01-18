/**
 * 徽章類型
 */
export type BadgeType = 'count' | 'dot' | 'text' | 'icon' | 'none';

/**
 * 徽章顏色
 */
export type BadgeColor = 'primary' | 'accent' | 'warn' | 'success' | 'info' | 'default';

/**
 * 徽章位置
 */
export type BadgePosition = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'inline';

/**
 * 徽章配置
 */
export interface BadgeConfig {
  type: BadgeType;
  color: BadgeColor;
  position?: BadgePosition;
  
  // Count type
  count?: number;
  maxCount?: number;
  
  // Text type
  text?: string;
  
  // Icon type
  icon?: string;
  
  // 視覺
  tooltip?: string;
  pulse?: boolean;
  hidden?: boolean;
}

/**
 * 徽章值物件
 */
export class Badge {
  private constructor(
    private readonly type: BadgeType,
    private readonly color: BadgeColor,
    private readonly config: BadgeConfig
  ) {}

  /**
   * 創建計數徽章
   */
  static createCount(count: number, color: BadgeColor = 'primary', maxCount = 99): Badge {
    return new Badge('count', color, {
      type: 'count',
      color,
      count,
      maxCount
    });
  }

  /**
   * 創建點狀徽章
   */
  static createDot(color: BadgeColor = 'primary', pulse = false): Badge {
    return new Badge('dot', color, {
      type: 'dot',
      color,
      pulse
    });
  }

  /**
   * 創建文字徽章
   */
  static createText(text: string, color: BadgeColor = 'primary'): Badge {
    return new Badge('text', color, {
      type: 'text',
      color,
      text
    });
  }

  /**
   * 創建圖標徽章
   */
  static createIcon(icon: string, color: BadgeColor = 'primary'): Badge {
    return new Badge('icon', color, {
      type: 'icon',
      color,
      icon
    });
  }

  /**
   * 創建空徽章 (隱藏)
   */
  static createNone(): Badge {
    return new Badge('none', 'default', {
      type: 'none',
      color: 'default',
      hidden: true
    });
  }

  /**
   * 獲取徽章類型
   */
  getType(): BadgeType {
    return this.type;
  }

  /**
   * 獲取徽章顏色
   */
  getColor(): BadgeColor {
    return this.color;
  }

  /**
   * 獲取徽章配置
   */
  getConfig(): BadgeConfig {
    return { ...this.config };
  }

  /**
   * 獲取顯示文字
   */
  getDisplayText(): string {
    switch (this.type) {
      case 'count':
        if (this.config.count === undefined) return '';
        const maxCount = this.config.maxCount || 99;
        return this.config.count > maxCount ? `${maxCount}+` : String(this.config.count);
      
      case 'text':
        return this.config.text || '';
      
      case 'icon':
        return this.config.icon || '';
      
      default:
        return '';
    }
  }

  /**
   * 是否應該顯示
   */
  shouldShow(): boolean {
    if (this.config.hidden) return false;
    if (this.type === 'none') return false;
    if (this.type === 'count' && (this.config.count === undefined || this.config.count === 0)) return false;
    return true;
  }

  /**
   * 複製並更新計數
   */
  withCount(count: number): Badge {
    if (this.type !== 'count') {
      throw new Error('Cannot update count on non-count badge');
    }
    
    return new Badge(this.type, this.color, {
      ...this.config,
      count
    });
  }

  /**
   * 複製並設置 tooltip
   */
  withTooltip(tooltip: string): Badge {
    return new Badge(this.type, this.color, {
      ...this.config,
      tooltip
    });
  }

  /**
   * 複製並設置 pulse 效果
   */
  withPulse(pulse: boolean): Badge {
    return new Badge(this.type, this.color, {
      ...this.config,
      pulse
    });
  }
}

/**
 * 徽章輔助函數
 */

/**
 * 格式化計數顯示
 */
export function formatBadgeCount(count: number, maxCount = 99): string {
  if (count <= 0) return '';
  if (count > maxCount) return `${maxCount}+`;
  return String(count);
}

/**
 * 根據計數選擇顏色
 */
export function getBadgeColorByCount(count: number): BadgeColor {
  if (count === 0) return 'default';
  if (count <= 5) return 'info';
  if (count <= 20) return 'primary';
  if (count <= 50) return 'accent';
  return 'warn';
}

/**
 * 獲取徽章 CSS 類別
 */
export function getBadgeClasses(badge: Badge): string[] {
  const classes = ['badge'];
  
  classes.push(`badge-${badge.getType()}`);
  classes.push(`badge-${badge.getColor()}`);
  
  const config = badge.getConfig();
  if (config.pulse) classes.push('badge-pulse');
  if (!badge.shouldShow()) classes.push('badge-hidden');
  
  return classes;
}
