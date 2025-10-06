export type TaskStatus = "pending" | "in_progress" | "cancelled" | "completed";
import type { Geometry, Feature, FeatureCollection } from 'geojson';

export type Priority = "high" | "medium" | "low";


export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  assignmentId?: number;
  priority: Priority;
}

export interface ApiTask {
  id: number;
  title: string;
  description: string;
  assignments: { status: string }[];
  priority: Priority;
}

export interface TaskAssignment{
    id: number;
    task: number;
    organization: number;
    status: TaskStatus;
    created_at: string;
    updated_at: string;
}

export interface TaskDetail {
  id: number;
  title: string;
  description: string;
  priority: string;
  prediction: number | null;
  agent: number | null;
  assignments: Record<string, unknown>[]; 
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  role: "organization" | "admin";
  org_name: string;
  logo_image: string | null;
  is_active: boolean;
  is_staff: boolean;
  is_superuser: boolean;
  created_at: string;
  updated_at: string;
}
export interface Country {
  country_id: string;
  countries_name: string;
  geometry: Geometry;
  is_affected: boolean;
}

export interface Region {
  region_id: string;
  region_name: string;
  country: string;
  geometry: Geometry;
  is_affected: boolean;
}
export interface QueryLog {
  id: number;
  query: string;
  response?: string;
  user_id?: number;
  created_at?: string;
}

export interface DiseaseRisk {
  disease_name?: string;
  risk_level?: string;
  risk_percent?: number;
}

export interface Prediction {
  prediction_id: number;
  description: string;
  disease_risks: Array<DiseaseRisk | string>;
  date_generated: string;
  region: string | null;
  country: string | null;
  lng: null | number;
  lat: null | number;
}

export type MapFeatureProperties = Country | Region;

export type MapFeature = Feature<Geometry, MapFeatureProperties>;

export type MapFeatureCollection = FeatureCollection<Geometry, MapFeatureProperties>;
