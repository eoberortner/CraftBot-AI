export interface ApiResponse<T> {
  data?: T
  error?: string
  status: number
  success: boolean
}

export interface ApiError {
  message: string
  status: number
  details?: any
}

export class ApiClient {
  private baseUrl: string
  private defaultTimeout: number

  constructor(baseUrl: string = 'http://localhost:8000', timeout: number = 30000) {
    this.baseUrl = baseUrl
    this.defaultTimeout = timeout
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const isJson = response.headers.get('content-type')?.includes('application/json')
    
    try {
      if (isJson) {
        const data = await response.json()
        
        if (response.ok) {
          return {
            data,
            status: response.status,
            success: true
          }
        } else {
          // Handle API error responses
          const errorMessage = data.detail || data.message || `HTTP ${response.status}: ${response.statusText}`
          return {
            error: errorMessage,
            status: response.status,
            success: false
          }
        }
      } else {
        const text = await response.text()
        
        if (response.ok) {
          return {
            data: text as unknown as T,
            status: response.status,
            success: true
          }
        } else {
          return {
            error: `HTTP ${response.status}: ${text || response.statusText}`,
            status: response.status,
            success: false
          }
        }
      }
    } catch (parseError) {
      return {
        error: `Failed to parse response: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        status: response.status,
        success: false
      }
    }
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {},
    timeout?: number
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`
    const requestTimeout = timeout || this.defaultTimeout

    // Create AbortController for timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), requestTimeout)

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      })

      clearTimeout(timeoutId)
      return await this.handleResponse<T>(response)

    } catch (error) {
      clearTimeout(timeoutId)
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          return {
            error: `Request timeout after ${requestTimeout / 1000} seconds`,
            status: 408,
            success: false
          }
        }
        
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          return {
            error: 'Network error - please check your connection and try again',
            status: 0,
            success: false
          }
        }
        
        return {
          error: error.message,
          status: 0,
          success: false
        }
      }

      return {
        error: 'An unexpected error occurred',
        status: 0,
        success: false
      }
    }
  }

  async get<T>(endpoint: string, timeout?: number): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'GET' }, timeout)
  }

  async post<T>(endpoint: string, data?: any, timeout?: number): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint, 
      { 
        method: 'POST',
        body: data ? JSON.stringify(data) : undefined 
      }, 
      timeout
    )
  }

  async put<T>(endpoint: string, data?: any, timeout?: number): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(
      endpoint, 
      { 
        method: 'PUT',
        body: data ? JSON.stringify(data) : undefined 
      }, 
      timeout
    )
  }

  async delete<T>(endpoint: string, timeout?: number): Promise<ApiResponse<T>> {
    return this.makeRequest<T>(endpoint, { method: 'DELETE' }, timeout)
  }
}

// Default API client instance
export const apiClient = new ApiClient()

// Convenience functions for common endpoints
export const breweryApi = {
  searchBreweries: (zipcode: string, radiusMiles: number = 25) =>
    apiClient.get(`/breweries/search/${zipcode}?radius_miles=${radiusMiles}&include_tap_lists=true`, 45000),
  
  getTapAnalysis: (zipcode: string, radiusMiles: number = 25) =>
    apiClient.get(`/breweries/tap-analysis/${zipcode}?radius_miles=${radiusMiles}`, 30000),
  
  getMarketIntelligence: (zipcode: string, radiusMiles: number = 25) =>
    apiClient.get(`/breweries/market-intelligence/${zipcode}?radius_miles=${radiusMiles}`, 30000),
}

export const cacheApi = {
  getStats: () => apiClient.get('/cache/stats'),
  clearAll: () => apiClient.delete('/cache/clear'),
  clearZipcode: (zipcode: string) => apiClient.delete(`/cache/clear/${zipcode}`),
  cleanup: () => apiClient.post('/cache/cleanup'),
}

export const recipeApi = {
  getStyles: () => apiClient.get('/beer-styles'),
  getRecipes: () => apiClient.get('/recipes'),
  analyzeRecipe: (data: any) => apiClient.post('/recipes/analyze', data),
  generateBrewingGuide: (data: any) => apiClient.post('/brewing-guide', data),
  generateShoppingList: (data: any) => apiClient.post('/shopping-list', data),
}

// Error classification helper
export function getErrorType(response: ApiResponse<any>): string {
  if (!response.success && response.error) {
    const error = response.error.toLowerCase()
    
    if (response.status === 0 || error.includes('network') || error.includes('fetch')) {
      return 'network'
    }
    if (response.status >= 500) {
      return 'server'
    }
    if (response.status === 400 || error.includes('validation') || error.includes('invalid')) {
      return 'validation'
    }
    if (response.status === 404 || error.includes('not found')) {
      return 'not-found'
    }
    if (response.status === 408 || error.includes('timeout')) {
      return 'timeout'
    }
  }
  
  return 'generic'
}

// Retry helper
export async function withRetry<T>(
  apiCall: () => Promise<ApiResponse<T>>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<ApiResponse<T>> {
  let lastResponse: ApiResponse<T> | null = null
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    lastResponse = await apiCall()
    
    if (lastResponse.success) {
      return lastResponse
    }
    
    // Don't retry for client errors (4xx) except timeout
    if (lastResponse.status >= 400 && lastResponse.status < 500 && lastResponse.status !== 408) {
      return lastResponse
    }
    
    // Don't retry on the last attempt
    if (attempt < maxRetries) {
      await new Promise(resolve => setTimeout(resolve, delay * attempt))
    }
  }
  
  return lastResponse!
}
