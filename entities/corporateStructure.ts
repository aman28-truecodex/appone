export class CorporateStructure {
  code: string;
  name: string;
  parentCode: string;
  parentName: string;
  type: string;
  head: string;
  location: string;
  employeeCount: number;
  managerName: string;
  logoUrl: string;
  missionStmt: string = 'The Vision statetment and mission statement are often confused,and many companies use the terms interchangeably. However,they each have a different purpose';
  visionStmt: string;
  valuesStmt: string;
}
