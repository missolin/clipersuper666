import { storage } from './storage';

const MAINTENANCE_INTERVAL = 12 * 60 * 60 * 1000; // 12小时
const STORAGE_WARNING_THRESHOLD = 80; // 80%
const DATA_RETENTION_DAYS = 90; // 90天数据保留期
const BACKUP_INTERVAL = 7 * 24 * 60 * 60 * 1000; // 7天

export const maintenance = {
  // 执行所有维护任务
  performMaintenance: async () => {
    try {
      await Promise.all([
        maintenance.checkStorageQuota(),
        maintenance.cleanupExpiredData(),
        maintenance.checkBackupNeeded(),
        maintenance.optimizePerformance(),
        maintenance.validateData()
      ]);
      
      // 记录最后维护时间
      localStorage.setItem('lastMaintenance', new Date().toISOString());
      console.log('系统维护完成');
    } catch (error) {
      console.error('系统维护失败:', error);
    }
  },

  // 检查存储配额
  checkStorageQuota: async () => {
    if ('storage' in navigator && 'estimate' in navigator.storage) {
      try {
        const { usage, quota } = await navigator.storage.estimate();
        if (usage && quota) {
          const usagePercent = (usage / quota) * 100;
          if (usagePercent > STORAGE_WARNING_THRESHOLD) {
            console.warn(`存储空间使用率高: ${usagePercent.toFixed(2)}%`);
            await maintenance.cleanupExpiredData();
          }
        }
      } catch (error) {
        console.error('存储检查失败:', error);
      }
    }
  },

  // 清理过期数据
  cleanupExpiredData: async () => {
    try {
      const now = new Date();
      const users = storage.getUsers();
      
      // 遍历所有用户数据
      Object.keys(users).forEach(username => {
        const contents = storage.loadContent(username);
        const filteredContents = contents.filter(content => {
          const contentDate = new Date(content.timestamp || Date.now());
          const daysDiff = (now.getTime() - contentDate.getTime()) / (1000 * 60 * 60 * 24);
          return daysDiff <= DATA_RETENTION_DAYS;
        });
        
        if (filteredContents.length < contents.length) {
          storage.saveContent(username, JSON.stringify(filteredContents));
        }
      });

      console.log('过期数据清理完成');
    } catch (error) {
      console.error('数据清理失败:', error);
    }
  },

  // 检查是否需要备份
  checkBackupNeeded: () => {
    try {
      const lastBackup = localStorage.getItem('lastBackup');
      if (!lastBackup || (Date.now() - new Date(lastBackup).getTime()) > BACKUP_INTERVAL) {
        maintenance.createBackup();
      }
    } catch (error) {
      console.error('备份检查失败:', error);
    }
  },

  // 创建数据备份
  createBackup: () => {
    try {
      const backup = {
        timestamp: new Date().toISOString(),
        users: storage.getUsers(),
        data: {}
      };

      // 收集所有用户数据
      Object.keys(backup.users).forEach(username => {
        backup.data[username] = storage.loadContent(username);
      });

      // 保存备份
      localStorage.setItem('clipboardBackup', JSON.stringify(backup));
      localStorage.setItem('lastBackup', new Date().toISOString());
      console.log('数据备份完成');
    } catch (error) {
      console.error('备份创建失败:', error);
    }
  },

  // 恢复备份
  restoreFromBackup: () => {
    try {
      const backupData = localStorage.getItem('clipboardBackup');
      if (!backupData) return false;

      const backup = JSON.parse(backupData);
      
      // 恢复用户数据
      Object.entries(backup.users).forEach(([username, user]) => {
        storage.saveUser(username, (user as any).passwordHash);
      });

      // 恢复剪贴板数据
      Object.entries(backup.data).forEach(([username, contents]) => {
        storage.saveContent(username, JSON.stringify(contents));
      });

      console.log('数据恢复完成');
      return true;
    } catch (error) {
      console.error('数据恢复失败:', error);
      return false;
    }
  },

  // 优化性能
  optimizePerformance: () => {
    try {
      // 清理过大的数据集
      Object.keys(localStorage).forEach(key => {
        const value = localStorage.getItem(key);
        if (value && value.length > 1000000) { // 1MB
          const data = JSON.parse(value);
          if (Array.isArray(data)) {
            // 保留最新的1000条记录
            localStorage.setItem(key, JSON.stringify(data.slice(0, 1000)));
          }
        }
      });

      console.log('性能优化完成');
    } catch (error) {
      console.error('性能优化失败:', error);
    }
  },

  // 验证数据完整性
  validateData: () => {
    try {
      const users = storage.getUsers();
      let isValid = true;

      Object.entries(users).forEach(([username, user]) => {
        if (!user || typeof user !== 'object' || !user.passwordHash) {
          console.warn(`发现无效用户数据: ${username}`);
          isValid = false;
        }

        const contents = storage.loadContent(username);
        if (!Array.isArray(contents)) {
          console.warn(`发现无效内容数据: ${username}`);
          isValid = false;
        }
      });

      if (!isValid) {
        maintenance.restoreFromBackup();
      }

      console.log('数据验证完成');
    } catch (error) {
      console.error('数据验证失败:', error);
    }
  },

  // 启动定期维护
  startAutoMaintenance: () => {
    // 初始维护
    maintenance.performMaintenance();

    // 设置定期维护
    setInterval(() => {
      maintenance.performMaintenance();
    }, MAINTENANCE_INTERVAL);
  }
};