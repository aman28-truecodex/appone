import {Injectable} from '@angular/core';

@Injectable()
export class StrategyAnalysisService {
  codeAndName: any;
  constructor() {

  }

  public strategyAnalysis = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Strengths',
        criterias: []
      },
      {
        title: 'Weaknesses',
        criterias: []
      },
      {
        title: 'Opportunities',
        criterias: []
      },
      {
        title: 'Threats',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };

  public strategyAnalysisUndefined = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Strengths',
        criterias: []
      },
      {
        title: 'Weaknesses',
        criterias: []
      },
      {
        title: 'Opportunities',
        criterias: []
      },
      {
        title: 'Threats',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };


  public pestalAnalysis = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Political Analysis',
        criterias: []
      },
      {
        title: 'Economic Analysis',
        criterias: []
      },
      {
        title: 'Social Analysis',
        criterias: []
      },
      {
        title: 'Technological Analysis',
        criterias: []
      },
      {
        title: 'Environmental Analysis',
        criterias: []
      },
      {
        title: 'Legal Analysis',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };

  public pestalAnalysisUndefined = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Political Analysis',
        criterias: []
      },
      {
        title: 'Economic Analysis',
        criterias: []
      },
      {
        title: 'Social Analysis',
        criterias: []
      },
      {
        title: 'Technological Analysis',
        criterias: []
      },
      {
        title: 'Environmental Analysis',
        criterias: []
      },
      {
        title: 'Legal Analysis',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };

  public PorterFiveForce = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Supplier Power',
        criterias: []
      },
      {
        title: 'Buyer Power',
        criterias: []
      },
      {
        title: 'Competative Rivalry',
        criterias: []
      },
      {
        title: 'Threats of Substitution',
        criterias: []
      },
      {
        title: 'Threats of new entry',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };

  public PorterFiveForceUndefined = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Supplier Power',
        criterias: []
      },
      {
        title: 'Buyer Power',
        criterias: []
      },
      {
        title: 'Competative Rivalry',
        criterias: []
      },
      {
        title: 'Threats of Substitution',
        criterias: []
      },
      {
        title: 'Threats of new entry',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };

  public FourCornersAnalysis = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Driver',
        criterias: []
      },
      {
        title: 'Current Strategy',
        criterias: []
      },
      {
        title: 'Management Assumtions',
        criterias: []
      },
      {
        title: 'Capabilities',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };

  public FourCornersAnalysisUndefined = {
    orgCode: null,
    orgName: null,
    type: null,
    year: null,
    description: null,
    version: null,
    details: [
      {
        title: 'Driver',
        criterias: []
      },
      {
        title: 'Current Strategy',
        criterias: []
      },
      {
        title: 'Management Assumtions',
        criterias: []
      },
      {
        title: 'Capabilities',
        criterias: []
      }
    ],
    additionalFields: [
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      },
      {
        name: null,
        value: null
      }
    ]
  };
}
