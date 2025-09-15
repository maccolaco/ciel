@@ .. @@
-import { AppSidebar } from "@/components/app-sidebar"
-import {
-  Breadcrumb,
-  BreadcrumbItem,
-  BreadcrumbLink,
-  BreadcrumbList,
-  BreadcrumbPage,
-  BreadcrumbSeparator,
-} from "@/components/ui/breadcrumb"
-import { Separator } from "@/components/ui/separator"
-import {
-  SidebarInset,
-  SidebarProvider,
-  SidebarTrigger,
-} from "@/components/ui/sidebar"
+import React, { useState } from 'react'
+import { PortfolioUpload } from '@/components/portfolio-upload'
+import { PortfolioTable } from '@/components/portfolio-table'
+import { PortfolioSummary } from '@/components/portfolio-summary'
+import { PortfolioCharts } from '@/components/portfolio-charts'
+import { RiskMetrics } from '@/components/risk-metrics'
+import { usePortfolioStore } from '@/lib/store'
+import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
 
 export default function Page() {
+  const { holdings } = usePortfolioStore()
+  const [activeTab, setActiveTab] = useState('overview')
+
+  if (holdings.length === 0) {
+    return (
+      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
+        <PortfolioUpload onUploadComplete={() => setActiveTab('overview')} />
+      </div>
+    )
+  }
+
   return (
-    <SidebarProvider>
-      <AppSidebar />
-      <SidebarInset>
-        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
-          <SidebarTrigger className="-ml-1" />
-          <Separator
-            orientation="vertical"
-            className="mr-2 data-[orientation=vertical]:h-4"
-          />
-          <Breadcrumb>
-            <BreadcrumbList>
-              <BreadcrumbItem className="hidden md:block">
-                <BreadcrumbLink href="#">
-                  Building Your Application
-                </BreadcrumbLink>
-              </BreadcrumbItem>
-              <BreadcrumbSeparator className="hidden md:block" />
-              <BreadcrumbItem>
-                <BreadcrumbPage>Data Fetching</BreadcrumbPage>
-              </BreadcrumbItem>
-            </BreadcrumbList>
-          </Breadcrumb>
-        </header>
-        <div className="flex flex-1 flex-col gap-4 p-4">
-          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
-            <div className="bg-muted/50 aspect-video rounded-xl" />
-            <div className="bg-muted/50 aspect-video rounded-xl" />
-            <div className="bg-muted/50 aspect-video rounded-xl" />
+    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
+      <div className="container mx-auto p-6">
+        <div className="mb-8">
+          <h1 className="text-4xl font-bold text-gray-900 mb-2">
+            Ciel Portfolio Manager
+          </h1>
+          <p className="text-gray-600">
+            Professional portfolio risk management and analysis
+          </p>
+        </div>
+
+        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
+          <TabsList className="grid w-full grid-cols-4">
+            <TabsTrigger value="overview">Overview</TabsTrigger>
+            <TabsTrigger value="holdings">Holdings</TabsTrigger>
+            <TabsTrigger value="analytics">Analytics</TabsTrigger>
+            <TabsTrigger value="risk">Risk</TabsTrigger>
+          </TabsList>
+
+          <TabsContent value="overview" className="space-y-6">
+            <PortfolioSummary />
+            <PortfolioCharts />
+          </TabsContent>
+
+          <TabsContent value="holdings" className="space-y-6">
+            <PortfolioTable />
+          </TabsContent>
+
+          <TabsContent value="analytics" className="space-y-6">
+            <PortfolioCharts />
+          </TabsContent>
+
+          <TabsContent value="risk" className="space-y-6">
+            <RiskMetrics />
+            <div className="grid gap-4 md:grid-cols-2">
+              <div className="space-y-4">
+                <h3 className="text-lg font-semibold">Risk Analysis</h3>
+                <p className="text-sm text-gray-600">
+                  Comprehensive risk metrics help you understand your portfolio's exposure 
+                  to market volatility, concentration risk, and sector allocation.
+                </p>
+              </div>
+            </div>
+          </TabsContent>
+        </Tabs>
+
+        <div className="mt-8 text-center">
+          <button
+            onClick={() => window.location.reload()}
+            className="text-sm text-gray-500 hover:text-gray-700 underline"
+          >
+            Upload New Portfolio
+          </button>
+        </div>
+      </div>
+    </div>
+  )
+}
+