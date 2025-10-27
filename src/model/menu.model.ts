export class CreateMenuRequest {
  name: string;
  parentId?: string | null;
  order?: number;
  depth?: number;
}

export class UpdateMenuRequest {
  name?: string;
  parentId?: string | null;
  order?: number;
  depth?: number;
}

export class MenuResponse {
  id: string;
  name: string;
  parentId?: string | null;
  order: number;
  depth: number;
  createdAt: Date;
  updatedAt: Date;
  children?: MenuResponse[];
}
