import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'

import { ThemeProvider } from '@/components/site/theme-provider'

import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'DeepSeek Harness 技术图谱',
    template: '%s · DeepSeek Harness 技术图谱',
  },
  description:
    'DeepSeek Harness（dsh）全栈技术教程：Cordis 插件框架、Agent 生命周期、会话日志、工具执行管线、seam、Web 与 SDK 架构，配套架构图、数据流图与生命周期图。',
  keywords: [
    'DeepSeek Harness',
    'dsh',
    'Cordis',
    'agent harness',
    'agent loop',
    'capability seam',
    '架构图',
  ],
  applicationName: 'DeepSeek Harness 技术图谱',
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#f7f8fb' },
    { media: '(prefers-color-scheme: dark)', color: '#0b0e18' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="zh-CN"
      suppressHydrationWarning
      data-scroll-behavior="smooth"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider>
          <div className="pointer-events-none fixed inset-0 -z-10 bg-tech-glow" aria-hidden />
          <div className="pointer-events-none fixed inset-0 -z-10 bg-tech-grid" aria-hidden />
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-100 focus:rounded-lg focus:border focus:border-accent-line focus:bg-surface focus:px-3 focus:py-2 focus:text-sm"
          >
            跳到正文
          </a>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
