import ISchema from './ISchema';
import { PlatformSettingsService } from '@services/index';
import { find } from 'lodash';
import pubSub from '@/graph-ql/pub-sub';
import { withFilter } from 'graphql-subscriptions';

export class PlatformSettingsSchema implements ISchema {
  public platformSettingsService = new PlatformSettingsService();
  type = `
    # Platform Config Settings for the system
    type PlatformSettings {
      # Setting key
      key: String

      # Setting value
      value: JSONObject

      # When last update
      updatedAt: DateTime

      # When created
      createdAt: DateTime
    }
  `;
  query = `
    # Get global settings
    globalSettings: [PlatformSettings]
    # Get all settings (even if not enabled)
    allSettings:  [PlatformSettings] @isAuthenticated
  `;

  mutation = `
    # Update setting
    updateSettings (keyName: String! , valueObj: JSONObject!): PlatformSettings
    # Toggle enabled status of a setting
    toggleEnableSettings (keyName: String!): PlatformSettings
  `;

  subscription = `
    # Subscribe to an up global settings (emit when value change)
    updateGlobalSettings(keyName: String! , valueObj: JSONObject!): PlatformSettings
    # Subscribe to an up global settings (emit if enable status change)
    settingsChangeStatus(keyName: String! , status: Boolean!): PlatformSettings
    `;

  resolver = {
    Query: {
      globalSettings: async ( root ) => {
        return await this.platformSettingsService.GetGlobalSettings()
      },
      allSettings: async ( root ) => {
        return await this.platformSettingsService.getAllSettings()
      }
    },
    PlatformSettings: {},
    Mutation: {
      updateSettings: async ( root, {keyName, valueObj} ) => {
        // up vote the post
        const settings = await this.platformSettingsService.UpdateGlobalSettings( keyName, valueObj );
        if (settings) {
          // notify all subscribers
          const payload = {
            keyName,
            valueObj
          };
          pubSub.publish( 'updateGlobalSettings', payload );
          // return the post
          return settings;
        } else
          return null;
      },
      toggleEnableSettings: async ( root, {keyName} ) => {
        const settings = await this.platformSettingsService.ToggleSettingStatus( keyName );
        if (settings) {
          const payload = {
            keyName,
            status: settings.isEnabled
          };
          pubSub.publish( 'updateGlobalSettings', payload );
          return settings;
        } else
          return null;
      }
    },
    Subscription: {
      updateGlobalSettings: {
        subscribe: withFilter(
          () => pubSub.asyncIterator( 'updateGlobalSettings' ),
          ( payload, variables ) => {
            return payload.updateGlobalSettings.keyName === variables.keyName
          } )
      },
      settingsChangeStatus: {
        subscribe: withFilter(
          () => pubSub.asyncIterator( 'settingsChangeStatus' ),
          ( payload, variables ) => {
            return payload.settingsChangeStatus.keyName === variables.keyName
          } )
      }
    }
  };
}
