"use client";

import { Settings, Database, Users, Shield, Bell } from "lucide-react";

export default function SettingsPage() {
  const settingsSections = [
    {
      title: "Database",
      description: "Manage database connections and tables",
      icon: Database,
      items: [
        "Events table management",
        "Dojos table management",
        "Database backup",
        "Data export/import"
      ]
    },
    {
      title: "Users & Permissions",
      description: "Manage admin users and access control",
      icon: Users,
      items: [
        "Admin user management",
        "Permission settings",
        "Access logs",
        "Security settings"
      ]
    },
    {
      title: "System Settings",
      description: "Configure system preferences",
      icon: Settings,
      items: [
        "General settings",
        "Email notifications",
        "API configuration",
        "Cache management"
      ]
    },
    {
      title: "Security",
      description: "Security and authentication settings",
      icon: Shield,
      items: [
        "Authentication settings",
        "Password policies",
        "Session management",
        "Security logs"
      ]
    },
    {
      title: "Notifications",
      description: "Configure notification preferences",
      icon: Bell,
      items: [
        "Email notifications",
        "System alerts",
        "Event notifications",
        "User notifications"
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your application settings and preferences.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div key={section.title} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-4">
                <div className="flex-shrink-0">
                  <Icon className="h-8 w-8 text-blue-600" />
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {section.description}
                  </p>
                </div>
              </div>
              
              <ul className="space-y-2">
                {section.items.map((item, index) => (
                  <li key={index} className="text-sm text-gray-600 flex items-center">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full mr-2"></div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <div className="mt-4">
                <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">
                  Configure →
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Settings className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              Settings Coming Soon
            </h3>
            <div className="mt-2 text-sm text-yellow-700">
              <p>
                Advanced settings and configuration options will be available in future updates.
                For now, you can manage events and dojos through their respective sections.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
