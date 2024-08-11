import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { SearchProductDto } from './dto/search-product.dto';

type dataResponse = {
  UnitPrice: number;
  Description: string;
  Quantity: number;
  Country: string;
  InvoiceNo: string;
  InvoiceDate: Date;
  CustomerID: number;
  StockCode: string;
};

@Injectable()
export class SearchService {
  constructor(
    private readonly esService: ElasticsearchService,
    private readonly configService: ConfigService,
  ) {}

  public async createIndex() {
    const index = this.configService.get('ELASTICSEARCH_INDEX');
    const checkIndex = await this.esService.indices.exists({ index });
    // tslint:disable-next-line:early-exit
    if (!checkIndex) {
      this.esService.indices.create({
        index,
        body: {
          mappings: {
            properties: {
              alias: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              categories: {
                properties: {
                  alias: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  createdAt: {
                    type: 'date',
                  },
                  id: {
                    type: 'long',
                  },
                  status: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  title: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  updatedAt: {
                    type: 'date',
                  },
                },
              },
              createdAt: {
                type: 'date',
              },
              description: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              genders: {
                properties: {
                  alias: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  createdAt: {
                    type: 'date',
                  },
                  id: {
                    type: 'long',
                  },
                  status: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  title: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  updatedAt: {
                    type: 'date',
                  },
                },
              },
              id: {
                type: 'long',
              },
              images: {
                properties: {
                  id: {
                    type: 'long',
                  },
                  medium: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  small: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                  thumbnail: {
                    type: 'text',
                    fields: {
                      keyword: {
                        type: 'keyword',
                        ignore_above: 256,
                      },
                    },
                  },
                },
              },
              price: {
                type: 'long',
              },
              status: {
                type: 'text',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              title: {
                type: 'text',
                analyzer: 'autocomplete',
                search_analyzer: 'standard',
                fields: {
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
              updatedAt: {
                type: 'date',
              },
            },
          },
          settings: {
            analysis: {
              filter: {
                autocomplete_filter: {
                  type: 'edge_ngram',
                  min_gram: 1,
                  max_gram: 20,
                },
              },
              analyzer: {
                autocomplete: {
                  type: 'custom',
                  tokenizer: 'standard',
                  filter: ['lowercase', 'autocomplete_filter'],
                },
              },
            },
          },
        },
      });
    }
  }

  public async indexProduct(post: any) {
    return await this.esService.index({
      index: this.configService.get('ELASTICSEARCH_INDEX')!,
      body: post,
    });
  }

  public async updateProduct(post: any, id) {
    let response = await this.esService.updateByQuery({
      index: this.configService.get('ELASTICSEARCH_INDEX')!,
      body: {
        script: {
          source: `
            ctx._source = params.post;
          `,
          params: {
            post,
          },
        },
        query: {
          match: {
            id,
          },
        },
      },
    });
    if (!response.updated) {
      this.indexProduct(post);
    }
    return response;
  }

  public async remove(postId: number) {
    this.esService.deleteByQuery({
      index: this.configService.get('ELASTICSEARCH_INDEX')!,
      body: {
        query: {
          match: {
            id: postId,
          },
        },
      },
    });
  }

  async search(search: SearchProductDto) {
    let results = new Set();
    const response = await this.esService.search<any>({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        size: 50,
        query: {
          multi_match: {
            query: search.text,
            fields: ['title', 'description'],
          },
        },
      },
    });
    const hits = response.hits.hits;
    hits.map((item) => {
      results.add(item._source as dataResponse);
    });
    return Array.from(results);
    //return { results: Array.from(results), total: response.hits.total };
  }

  async getAll(query) {
    let results = new Set();
    const response = await this.esService.search<any>({
      index: this.configService.get('ELASTICSEARCH_INDEX'),
      body: {
        query: query,
      },
    });
    const hits = response.hits.hits;
    hits.map((item) => {
      results.add(item._source as dataResponse);
    });
    return Array.from(results);
    //return { results: Array.from(results), total: response.hits.total };
  }
}
